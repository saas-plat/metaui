import {
  readonly,
  nonenumerable
} from 'core-decorators';
import {
  observable,
  runInAction,
  configure
} from 'mobx';
import Expression from '@saas-plat/expression';
import _isPlainObject from 'lodash/isPlainObject';
import _forOwn from 'lodash/forOwn';
import _isArray from 'lodash/isArray';
import _mapValues from 'lodash/mapValues';
import _isSymbol from 'lodash/isSymbol';
import _set from 'lodash/set';
import _get from 'lodash/get';

// 计算属性会导致proxy的ownKeys没有返回报错
// proxy 约束：结果列表必须包含目标对象的所有不可配置（non-configurable ）、自有（own）属性的key.
configure({
  computedConfigurable: true
})

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
      return new Expression(defval);
    }
  }

  static getProp(store, val) {
    if (val instanceof Expression) {
      return store.execExpr(val);
    } else {
      // 直接返回可观察对象
      return val;
    }
  }

  static setProp(store, value, oldval) {
    if (_isPlainObject(value)) {
      if (oldval instanceof SubModel) {
        // 默认对象是合并操作
        _forOwn(value, (subval, subkey) => oldval[subkey] = subval);
        return null;
      } else {
        return new SubModel(store, value);
      }
    } else if (_isArray(value)) {
      return value;
    } else {
      return new Expression(value);
    }
  }

  static createProps(store, props) {
    return _mapValues(props, (...args) => Model.createProp(store, ...args));
  }

  static createProxy(store, props, target = {}) {
    props = Model.createProps(store, props);
    const map = observable.map(props);
    // 使用代理支持动态属性，减少模型的定义
    const proxy = new Proxy(target, {
      ownKeys(target) {
        // 这里必须调用map保证观察性
        const mapkeys = [...map.keys()];
        return Object.keys(target).filter(key => mapkeys.indexOf(key) === -1).concat(mapkeys);
      },
      deleteProperty(target, key) {
        if (typeof key === 'string' && map.has(key)) {
          delete target[key];
          return map.delete(key);
        } else if (key in target) {
          return delete target[key];
        }
        return false;
      },
      has(target, key) {
        // 这里必须调用map保证观察性
        return map.has(key) || key in target;
      },
      get(target, key) {
        // If it exist, return original member or function.
        if (key in target && !map.has(key)) {
          const fn = target[key];
          const isFunction = typeof fn === "function";
          return isFunction ?
            function (...args) {
              // 不能传target，导致函数里this无法获取动态属性
              const ret = fn.call(this, ...args);
              if (key === 'toJSON') {
                //console.log(ret)
                return {
                  ...ret,
                  ..._mapValues(map.toJSON(), (...props) => {
                    const v = Model.getProp(store, ...props);
                    return JSON.stringify(v, ...args.slice(1));
                  })
                }
              }
              return ret;
            } : fn;
        }
        if (key === 'toJSON') {
          return () => _mapValues(map.toJSON(), (...args) => JSON.stringify(Model.getProp(store, ...args)))
        }

        // 动态创建没有的属性，但是mobx可能也创建了symbol字段
        if (typeof key === 'string') {
          const upkey = key.substr(0, 1).toUpperCase() + key.substr(1);
          const getkey = 'get' + upkey;
          if (map.has(getkey)) {
            return _get(store, map.get(getkey));
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
        if (typeof key === 'string') {
          const upkey = key.substr(0, 1).toUpperCase() + key.substr(1);
          const setkey = 'set' + upkey;
          if (map.has(setkey)) {
            _set(store, map.get(setkey), value);
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
          } else if (!(key in target)) {
            const prop = Model.createProp(store, value);
            target[key] = prop;
            runInAction(() => {
              map.set(key, prop);
            });
          } else {
            target[key] = value;
          }
        } else {
          // if (key in target) {
          target[key] = value;
          // } else {
          //   return false;
          // }
        }
        return true;
      }
    });
    // 必须给target设置属性，要不ownKeys会过滤掉不存在的key
    Object.keys(props).forEach(key => {
      // 不能直接赋值，要不计算表达式内this.xx不是动态属性值
      // target[key] = props[key]
      Object.defineProperty(target, key, {
        configrable: true,
        enumerable: true,
        get: function () {
          return proxy[key];
        },
        set: function (val) {
          proxy[key] = val
        }
      })
    });
    return proxy;
  }

  constructor(store, {
    name,
    type,
    ...props
  }) {

    const key = assignId(props.type || 'vm');
    this.store = store;
    this.key = key;
    this.name = name || props.type || key;
    this.type = type;

    readonly(this, 'store');
    nonenumerable(this, 'store'); // toJSON排除

    readonly(this, 'type');
    readonly(this, 'key');
    readonly(this, 'name');

    // 系统key
    Object.keys(this).forEach(key => {
      if (key in props) {
        this[key] = props[key];
        //console.warn('model prop skip', key);
        delete props[key];
      }
    })

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
