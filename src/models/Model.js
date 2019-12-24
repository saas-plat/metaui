import {
  readonly
} from 'core-decorators';
import {
  observable,
  runInAction,
  isObservableMap,
  isObservableArray
} from 'mobx';
import Expression from 'saas-plat-expression';
import _isPlainObject from 'lodash/isPlainObject';
import _forOwn from 'lodash/forOwn';
import _isArray from 'lodash/isArray';
import UIStore from '../UIStore';

let gid = 0;
// 分配全局id
const assignId = (pre) => {
  // 每次加一
  gid = gid + 1;
  return (pre || '') + gid;
}

const createProp = (store, props, prikey, defval) => {
  if (_isPlainObject(defval)) {
    props[prikey] = observable.map(objectHelper(store, defval));
  } else if (_isArray(defval)) {
    props[prikey] = defval;
  } else {
    props[prikey] = UIStore.parseExpr(defval);
  }
}

const getProp = (store, props, prikey) => {
  if (props[prikey] instanceof Expression) {
    return store.execExpr(props[prikey]);
  } else if (isObservableMap(props[prikey])) {
    return props[prikey].toJSON();
  } else if (isObservableArray(props[prikey])) {
    return props[prikey].slice();
  } else {
    return props[prikey];
  }
}

const setProp = (store, props, prikey, value) => {
  if (_isPlainObject(value)) {
    if (isObservableMap(props[prikey])) {
      const val = objectHelper(store, value);
      // 这里是合并不是替换replace
      // merge认为是高频操作
      props[prikey].merge(val);
    } else {
      props[prikey] = observable.map(objectHelper(store, value));
    }
  } else if (_isArray(value)) {
    props[prikey] = value;
  } else {
    props[prikey] = UIStore.parseExpr(value);
  }
}

const objectHelper = (store, props) => {
  _forOwn(props, (defval, key) => {
    const upkey = key.substr(0, 1).toUpperCase() + key.substr(1);
    const prikey = '_' + upkey;
    createProp(store, props, prikey, defval);
    Object.defineProperty(props, key, {
      enumerable: true, // 这里必须是可枚举的要不observable不好使
      get: () => {
        return getProp(store, props, prikey);
      },
      set: (value) => {
        setProp(store, props, prikey, value);
      }
    })
  });
  return props;
}

const createProps = (store, defval, key, props) => {
  const upkey = key.substr(0, 1).toUpperCase() + key.substr(1);
  const setkey = 'set' + upkey;
  const getkey = 'get' + upkey;
  const prikey = Symbol(key);
  createProp(store, props, prikey, defval);
  Object.defineProperty(props, key, {
    //configurable: true,
    enumerable: true, // 这里必须是可枚举的要不observable不好使
    get: () => {
      // bind就使用bind的vm访问机制
      if (getkey in props) {
        return store.getViewModel(props[getkey]);
      }
      // 因为下面可以修改所以prikey的类型不确定
      return getProp(store, props, prikey);
    },
    set: (value) => {
      if (setkey in props) {
        return store.setViewModel(props[setkey], value);
      }
      setProp(store, props, prikey, value);
    }
  })
}

// 视图模型基类
export default class Model {
  store;
  key;
  name;

  constructor(store, {
    name,
    type,
    ...props
  }) {
    const key = assignId();
    this.store = store;
    this.key = key;
    this.name = name || props.type || key;
    this.type = type;

    readonly(this, 'type');
    readonly(this, 'store');
    readonly(this, 'key');
    readonly(this, 'name');

    // 支持表达式
    // 还是所有字段都要进行表达式转换，因为ui配置的是模型不是schema没有type信息
    _forOwn(props, (...args) => createProps(store, ...args));

    // 定义观察属性
    const map = observable.map(props);

    // 使用代理支持动态属性，减少模型的定义
    return new Proxy(this, {
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
              return fn(...args);
            } :
            target[key];
        }
        // 动态创建没有的属性，但是mobx可能也创建了symbol字段
        if (typeof key === 'string' && !map.has(key)) {
          const newprops = {};
          createProps(store, undefined, key, newprops);
          map.merge(newprops);
        }
        if (map.has(key)) {
          return map.get(key);
        } else {
          return target[key];
        }
      },
      set(target, key, value) {
        if (key in target) {
          target[key] = value;
        } else {
          if (map.has(key)) {
            runInAction(() => {
              map.set(key, value);
            })
          } else if (typeof key === 'string') {
            const newprops = {};
            createProps(store, value, key, newprops);
            map.merge(newprops);
          } else {
            return false;
          }
        }
        return true;
      }
    });
  }
}
