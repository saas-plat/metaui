import {
  assignId
} from './util';
import UIStore from './UIStore';

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
    let obj = ukeys.reduce((obj, key) => {
      const setkey = 'set' + key.substr(0, 1).toUpperCase() + key.substr(1);
      let valexpr = UIStore.parseExpr(this.props[key]);
      Object.defineProperty(obj, key, {
        enumerable: true, // 这里必须是可枚举的要不observable不好使
        get: () => {
          if (this.bind) {
            const bindval = store.getViewModel(this.bind + '.' + key);
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
      return obj;
    }, {});

    // 需要把bind字段视图状态字段生成出来
    if (this.bind) {
      const subvm = store.getViewModel(this.bind);
      obj = Object.keys(subvm).filter(key => ukeys.indexOf(key) === -1).reduce((obj, key) => {
        Object.defineProperty(obj, key, {
          enumerable: true, // 这里必须是可枚举的要不observable不好使
          get: () => {
            return store.getViewModel(this.bind + '.' + key);
          },
          set: (value) => {
            return store.setViewModel(this.bind + '.' + key, value);
          }
        });
        return obj;
      }, obj);
    }
    return {
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
      items: this.items.map(reducer)
    }
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
