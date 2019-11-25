import {
  observable,
  computed,
  toJS
} from "mobx";
import {
  assignId
} from './util';

export class Action {
  store;
  key;

  @observable nameExpr;
  @observable args;

  // 需要执行actions方法名称
  @computed get name() {
    return this.store.execExpr(this.nameExpr);
  }
  set name(nameExpr) {
    this.nameExpr = this.store.parseExpr(nameExpr);
  }

  constructor(store, name, args = {}) {
    this.key = assignId();
    this.store = store;
    this.nameExpr = this.store.parseExpr(name);
    const obj = {};
    const exprs = new Map();
    this.keys = Object.keys(args);
    this.keys.forEach(key => {
      exprs.set(key, store.parseExpr(args[key]));
      Object.defineProperty(obj, key, {
        enumerable: true, // 这里必须是可枚举的要不observable不好使
        get: () => {
          return store.execExpr(exprs.get(key));
        },
        set: (expr) => {
          exprs.set(key, store.parseExpr(expr));
        }
      });
    });
    this.args = observable(obj);
  }

  toJS() {
    const $args = this.args;
    return {
      name: this.nameExpr.toString(),
      args: this.keys.reduce((obj, key) => {
        obj[key] = $args[key];
        return obj;
      }, {})
    }
  }

  static create(store, obj) {
    if (typeof obj === 'string') {
      return new Action(store, obj);
    } else if (Array.isArray(obj)) {
      return obj.map(it => Action.create(store, it));
    } else if (obj) {
      const {
        name,
        args,
        ...other
      } = obj;
      return new Action(store, name, { ...other,
        ...args
      });
    } else {
      return null;
    }
  }
}
