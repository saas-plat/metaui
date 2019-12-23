import {
  readonly
} from 'core-decorators';
import {
  observable,
  extendObservable
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

const objectHelper = (store, props) => {
  _forOwn(props, (defval, key) => {
    const upkey = key.substr(0, 1).toUpperCase() + key.substr(1);
    const prikey = '_' + upkey;
    if (_isPlainObject(defval)) {
      props[prikey] = observable.map(objectHelper(store, defval));
    } else {
      props[prikey] = UIStore.parseExpr(defval);
    }
    Object.defineProperty(props, key, {
      enumerable: true, // 这里必须是可枚举的要不observable不好使
      get: () => {
        if (props[prikey] instanceof Expression) {
          return store.execExpr(props[prikey]);
        } else {
          return props[prikey];
        }
      },
      set: (value) => {
        if (_isPlainObject(value)) {
          const val = objectHelper(value);
          // 这里是合并不是替换replace
          // merge认为是高频操作
          props[prikey].merge(val);
        } else {
          props[prikey] = UIStore.parseExpr(value);
        }
      }
    })
  });
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
    _forOwn(props, (defval, key) => {
      const upkey = key.substr(0, 1).toUpperCase() + key.substr(1);
      const setkey = 'set' + upkey;
      const getkey = 'get' + upkey;
      const prikey = '_' + key;
      if (_isPlainObject(defval)) {
        props[prikey] = observable.map(objectHelper(store, defval));
      } else if (_isArray(defval)) {
        props[prikey] = defval;
      } else {
        props[prikey] = UIStore.parseExpr(defval);
      }
      Object.defineProperty(props, key, {
        enumerable: true, // 这里必须是可枚举的要不observable不好使
        get: () => {
          // bind就使用bind的vm访问机制
          if (props[getkey]) {
            return store.getViewModel(props[getkey]);
          }
          // 因为下面可以修改所以prikey的类型不确定
          if (props[prikey] instanceof Expression) {
            return store.execExpr(props[prikey]);
          } else {
            return props[prikey];
          }
        },
        set: (value) => {
          if (props[setkey]) {
            return store.setViewModel(props[setkey], value);
          }
          if (_isPlainObject(value)) {
            const val = objectHelper(store, value);
            // 这里是合并不是替换replace
            // merge认为是高频操作
            props[prikey].merge(val);
          } else if (_isArray(value)) {
            props[prikey] = value;
          } else {
            props[prikey] = UIStore.parseExpr(value);
          }
        }
      })
    });

    // 可以定义容器属性
    extendObservable(this, props);
  }

}
