import {
  observable,
  computed,
  action,
  toJS
} from "mobx";
import {
  assignId
} from './util';

export class Action {
  store;
  key;

  @observable nameExpr;
  @observable args = observable.map();
  exprs = {};

  // 需要执行actions方法名称
  @computed get name() {
    return this.store.execExpr(this.nameExpr);
  }
  set name(nameExpr) {
    this.nameExpr = this.store.parseExpr(nameExpr);
  }

  @action setArg(args) {
    const obj = {};
    Object.keys(args).forEach(key => {
      this.exprs[key] = this.store.parseExpr(args[key]);
      Object.defineProperty(obj, key, {
        enumerable: true, // 这里必须是可枚举的要不observable不好使
        get: () => {
          return store.execExpr(this.exprs[key]);
        },
        set: (expr) => {
          this.exprs[key] = store.parseExpr(expr);
        }
      });
    });
    this.args.merge(args);
  }

  @action removeArg(...names) {
    for (const name of names) {
      this.args.delete(name);
    }
  }

  @action clearArgs() {
    this.args.clear();
  }

  constructor(store, name, args = {}) {
    this.key = assignId();
    this.store = store;
    this.nameExpr = this.store.parseExpr(name);
    this.setArg(args);
  }

  toJS() {
    return {
      name: this.nameExpr.toString(),
      args: Object.keys(this.exprs).reduce((obj, key) => {
        obj[key] = this.exprs[key].toString();
        return obj;
      }, {})
    }
  }

  static createSchema(obj) {
    if (typeof obj === 'string') {
      console.log('create %s action...', obj)
      return {
        type: Action,
        args: [obj]
      };
    } else if (Array.isArray(obj)) {
      return obj.map(it => Action.createSchema(it));
    } else if (obj) {
      console.log('create %s action...', obj.name)
      const {
        name,
        args,
        ...other
      } = obj;
      return {
        type: Action,
        args: [name, {
          ...other,
          ...args
        }]
      }
    } else {
      // 这里就是支持返回无行为
      return null;
    }
  }
}
