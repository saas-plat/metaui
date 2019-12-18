import {
  toJS,
  observable,
} from "mobx";
import _isPlainObject from 'lodash/isPlainObject';
import UIStore from './UIStore';

let gid = 0;
// 分配全局id
const assignId = (pre) => {
  // 每次加一
  gid = gid + 1;
  return (pre || '') + gid;
}

const createArgs = (val) => {
  return Object.keys(val).reduce((obj, key) => {
    let subexpr = UIStore.parseExpr(val[key]);
    Object.defineProperty(obj, key, {
      enumerable: true, // 这里必须是可枚举的要不observable不好使
      get: () => {
        return this.store.execExpr(subexpr);
      },
      set: (expr) => {
        subexpr = UIStore.parseExpr(expr);
      }
    });
    return obj;
  }, {});
}

export default class UISchema {
  type;
  bind;
  props;
  items;

  constructor(type, bind, props, items = []) {
    this.type = type;
    this.props = props;
    this.items = items;
  }

  createModel(store, reducer) {
    const key = assignId(this.type);
    const ukeys = Object.keys(this.props);
    const bkey = this.bind;
    let obj = ukeys.reduce((obj, key) => {
      const upkey = key.substr(0, 1).toUpperCase() + key.substr(1);
      const setkey = 'set' + upkey;
      const val = this.props[key];
      if (typeof val === 'string') {
        let valexpr = UIStore.parseExpr(val);
        Object.defineProperty(obj, key, {
          enumerable: true, // 这里必须是可枚举的要不observable不好使
          get: () => {
            if (bkey) {
              const bindval = store.getViewModel(bkey + '.' + key);
              if (bindval) {
                return bindval;
              }
            }
            return store.execExpr(valexpr);
          },
          set: (value) => {
            if (this[setkey]) {
              return store.setViewModel(this[setkey], value);
            }
            valexpr = UIStore.parseExpr(value);
          }
        });
      } else if (_isPlainObject(val)) {
        const skey = '_' + key;
        obj[skey] = observable.map();
        this[skey].merge(createArgs(val));
        Object.defineProperty(obj, key, {
          enumerable: true, // 这里必须是可枚举的要不observable不好使
          get: () => {
            if (bkey) {
              const bindval = store.getViewModel(bkey + '.' + key);
              if (bindval) {
                return bindval;
              }
            }
            return this[skey].toJSON();
          },
          set: (value) => {
            if (this[setkey]) {
              return store.setViewModel(this[setkey], value);
            }
            const obj = createArgs(value);
            this[skey].merge(obj);
          }
        });
        obj['remove' + upkey] = (...names) => {
          if (this['set' + upkey]) {
            const per = this['set' + upkey];
            for (const name of names) {
              store.setViewModel(per + (per ? '.' : '') + name, undefined);
            }
            return
          }
          for (const name of names) {
            this[skey].delete(name);
          }
        }
        obj['clear' + upkey] = () => {
          if (this['set' + upkey]) {
            const per = this['set' + upkey];
            const args = store.execExpr(per);
            const names = Object.keys(toJS(args));
            for (const name of names) {
              store.setViewModel(per + (per ? '.' : '') + name, undefined);
            }
            return
          }
          this[skey].clear();
        }
      } else {
        Object.defineProperty(obj, key, {
          enumerable: true, // 这里必须是可枚举的要不observable不好使
          get: () => {
            if (bkey) {
              const bindval = store.getViewModel(bkey + '.' + key);
              if (bindval) {
                return bindval;
              }
            }
            return val;
          },
          set: (value) => {
            if (this[setkey]) {
              return store.setViewModel(this[setkey], value);
            }
            this.props[key] = value;
          }
        });
      }
      return obj;
    }, {});

    // 需要把bind字段视图状态字段生成出来
    if (bkey) {
      const subvm = store.getViewModel(bkey);
      obj = Object.keys(subvm).filter(key => ukeys.indexOf(key) === -1).reduce((obj, key) => {
        Object.defineProperty(obj, key, {
          enumerable: true, // 这里必须是可枚举的要不observable不好使
          get: () => {
            return store.getViewModel(bkey + '.' + key);
          },
          set: (value) => {
            return store.setViewModel(bkey + '.' + key, value);
          }
        });
        return obj;
      }, obj);
    }
    return observable({
      get store() {
        return store;
      },
      get key() {
        return key
      },
      get name() {
        return this.name || key
      },
      ...obj,
      _items: this.items.map(reducer),
      get items() {
        return this._items.filter(it => it.visible)
      },
      addItem: (...items) => {
        this._items.push(...items);
      },
      removeItem: (...names) => {
        for (const name of names) {
          const reit = this._items.find(it => it.name === name);
          if (reit) {
            this._items.splice(this._items.indexOf(reit), 1);
          } else {
            console.warn('uimodel items not exists!', name);
          }
        }
      },
      clearItems: () => {
        this._items.clear();
      }
    })
  }

  static createSchema({
    type,
    bind,
    items = [],
    ...props
  }) {
    return new UISchema(type, bind, props, items.map(UISchema.createSchema));
  }
}
