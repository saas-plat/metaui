import {
  readonly,
  nonenumerable
} from 'core-decorators';
import {
  observable,
  runInAction,
  isObservableArray
} from 'mobx';
import Expression from 'saas-plat-expression';
import _isPlainObject from 'lodash/isPlainObject';
import _forOwn from 'lodash/forOwn';
import _isArray from 'lodash/isArray';
import _mapValues from 'lodash/mapValues';
import _isSymbol from 'lodash/isSymbol';
import UIStore from '../UIStore';

let gid = 0;
// 分配全局id
const assignId = (pre) => {
  // 每次加一
  gid = gid + 1;
  return (pre || '') + gid;
}

class SubModel {
  constructor(store, props) {
    return Model.createProxy(store, props, this);
  }
}

// 视图模型基类
export default class Model {
  store;
  key;
  name;

  static createProp(store, defval) {
    if (_isPlainObject(defval)) {
      return new SubModel(store, defval);
    } else if (_isArray(defval)) {
      return defval;
    } else {
      return UIStore.parseExpr(defval);
    }
  }

  static getProp(store, val) {
    if (val instanceof Expression) {
      return store.execExpr(val);
      // } else if (isObservableMap(val)) {
      //   return val.toJSON();
    } else if (isObservableArray(val)) {
      return val.slice();
    } else {
      return val;
    }
  }

  static setProp(store, value, val) {
    if (_isPlainObject(value)) {
      if (val instanceof Proxy) {
        // 默认对象是合并操作
        _forOwn(value, (subval, subkey) => val[subkey] = subval);
        return null;
      } else {
        val = Model.createProxy(store, value);
      }
    } else if (_isArray(value)) {
      val = value;
    } else {
      val = UIStore.parseExpr(value);
    }
    return val;
  }

  static createProps(store, props) {
    return _mapValues(props, (...args) => Model.createProp(store, ...args));
  }

  static createProxy(store, props, target = {}) {
    props = Model.createProps(store, props);
    const map = observable.map(props);
    // 使用代理支持动态属性，减少模型的定义
    return new Proxy(target, {
      ownKeys(target) {
        return [...Object.keys(target), ...map.keys()];
      },
      deleteProperty(target, key) {
        if (key in target) {
          return delete target[key];
        } else if (typeof key === 'string' && map.has(key)) {
          return map.delete(key);
        }
        return false;
      },
      has(target, key) {
        return key in target || map.has(key);
      },
      get(target, key) {
        // If it exist, return original member or function.
        if (key in target) {
          const fn = target[key];
          const isFunction = typeof fn === "function";
          return isFunction ?
            function (...args) {
              const ret = fn.call(target, ...args);
              if (key === 'toJSON') {
                //console.log(ret)
                return {
                  ...ret,
                  ..._mapValues(map.toJSON(), (...args) => JSON.stringify(Model.getProp(store, ...args))),
                }
              }
              return ret;
            } :
            target[key];
        }
        if (key === 'toJSON') {
          return () => _mapValues(map.toJSON(), (...args) => JSON.stringify(Model.getProp(store, ...args)))
        }

        // 动态创建没有的属性，但是mobx可能也创建了symbol字段
        if (typeof key === 'string') {
          const upkey = key.substr(0, 1).toUpperCase() + key.substr(1);
          const getkey = 'get' + upkey;
          if (map.has(getkey)) {
            return store.getViewModel(map.get(getkey));
          }
          // map不需要提前创建就可以保证观察
          // if (!map.has(key)) {
          //   map.merge({key:createProp(store, undefined )});
          // }
        }
        if (!_isSymbol(key) && map.has(key)) {
          const val = map.get(key);
          return Model.getProp(store, val);
        } else {
          return target[key];
        }
      },
      set(target, key, value) {
        if (key in target) {
          target[key] = value;
        } else if (!_isSymbol(key)) {
          const upkey = key.substr(0, 1).toUpperCase() + key.substr(1);
          const setkey = 'set' + upkey;
          if (map.has(setkey)) {
            store.setViewModel(map.get(setkey), value);
            return true;
          }
          if (map.has(key)) {
            let val = map.get(key);
            val = Model.setProp(store, value, val);
            if (!val) {
              return true;
            }
            runInAction(() => {
              map.set(key, val);
            })
          } else {
            map.set(key, Model.createProp(store, value));
          }
        } else {
          return false;
        }
        return true;
      }
    });
  }

  constructor(store, {
    name,
    type,
    ...props
  }) {
    const key = assignId(props.type);
    this.store = store;
    this.key = key;
    this.name = name || props.type || key;
    this.type = type;

    readonly(this, 'store');
    nonenumerable(this, 'store'); // toJSON排除

    readonly(this, 'type');
    readonly(this, 'key');
    readonly(this, 'name');

    // 支持表达式
    // 还是所有字段都要进行表达式转换，因为ui配置的是模型不是schema没有type信息
    return Model.createProxy(store, props, this);
  }

  toJSON() {
    return {
      key: this.key,
      name: this.name,
      type: this.type
    }
  }
}
