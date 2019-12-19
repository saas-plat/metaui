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
  props;
  items;

  constructor(type, props, items = []) {
    this.type = type;
    this.props = props;
    this.items = items;
  }

  createModel(store, reducer) {
    const key = assignId(this.type);
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
      ...this.props,
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
    items = [],
    ...fields
  }) {
    const ukeys = Object.keys(fields);
    const obj = ukeys.reduce((obj, key) => {
      const upkey = key.substr(0, 1).toUpperCase() + key.substr(1);
      const setkey = 'set' + upkey;
      const getkey = 'get' + upkey;
      const skey = key + 'Field';
      const val = fields[key];
      // 不支持纯计算字段，有可能修改get和setkey导致变成不是纯计算字段
      // if (ukeys.indexOf(getkey) > -1 && ukeys.indexOf(setkey) > -1) {
      //   Object.defineProperty(obj, key, {
      //     enumerable: true, // 这里必须是可枚举的要不observable不好使
      //     get: () => {
      //       return this.store.getViewModel(this[getkey]);
      //     },
      //     set: (value) => {
      //       return this.store.setViewModel(this[setkey], value);
      //     }
      //   });
      // } else
      if (_isPlainObject(val)) {
        obj[skey] = observable.map();
        this[skey].merge(createArgs(val));
        Object.defineProperty(obj, key, {
          enumerable: true, // 这里必须是可枚举的要不observable不好使
          get: () => {
            if (this[getkey]) {
              return this.store.getViewModel(this[getkey]);
            }
            return this[skey].toJSON();
          },
          set: (value) => {
            if (this[setkey]) {
              return this.store.setViewModel(this[setkey], value);
            }
            const obj = createArgs(value);
            this[skey].merge(obj);
          }
        });
        obj['remove' + upkey] = (...names) => {
          if (this['set' + upkey]) {
            const per = this['set' + upkey];
            for (const name of names) {
              this.store.setViewModel(per + (per ? '.' : '') + name, undefined);
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
            const args = this.store.execExpr(per);
            const names = Object.keys(toJS(args));
            for (const name of names) {
              this.store.setViewModel(per + (per ? '.' : '') + name, undefined);
            }
            return
          }
          this[skey].clear();
        }
      } else {
        obj[skey] = UIStore.parseExpr(val);
        Object.defineProperty(obj, key, {
          enumerable: true, // 这里必须是可枚举的要不observable不好使
          get: () => {
            if (this[getkey]) {
              return this.store.getViewModel(this[getkey]);
            }
            return this.store.execExpr(this.skey);
          },
          set: (value) => {
            if (this[setkey]) {
              return this.store.setViewModel(this[setkey], value);
            }
            this.skey = UIStore.parseExpr(value);
          }
        });
      }
      return obj;
    }, {});
    return new UISchema(type, obj, items.map(UISchema.createSchema));
  }
}
