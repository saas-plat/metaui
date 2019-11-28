import {
  observable,
  computed,
  action,
} from "mobx";
import {
  assignId
} from './util';
import UIStore from '../UIStore';

export class Action {
  store;
  key;

  @observable nameExpr;
  @observable setNameExpr;
  @observable _args = observable.map();
  exprs = {};

  // 需要执行actions方法名称
  @computed get name() {
    return this.store.execExpr(this.nameExpr);
  }
  set name(value) {
    if (this.setName) {
      return this.store.setViewModel(this.setName, value);
    }
    this.nameExpr = UIStore.parseExpr(value);
  }
  @computed get setName() {
    return this.store.execExpr(this.setNameExpr);
  }
  set setName(setValue) {
      this.setNameExpr = UIStore.parseExpr(setValue);
  }

  @computed get args() {
    return this._args.toJSON();
  }

  @action setArg(args) {
    const obj = {};
    Object.keys(args).forEach(key => {
      this.exprs[key] = UIStore.parseExpr(args[key]);
      Object.defineProperty(obj, key, {
        enumerable: true, // 这里必须是可枚举的要不observable不好使
        get: () => {
          return this.store.execExpr(this.exprs[key]);
        },
        set: (expr) => {
          this.exprs[key] = UIStore.parseExpr(expr);
        }
      });
    });
    this._args.merge(obj);
  }

  @action removeArg(...names) {
    for (const name of names) {
      this._args.delete(name);
    }
  }

  @action clearArgs() {
    this._args.clear();
  }

  constructor(store, nameExpr, args = {}) {
    this.key = assignId();
    this.store = store;
    this.nameExpr = nameExpr;
    this._args.merge(Object.keys(args).reduce((obj, key) => {
      this.exprs[key] = args[key];
      Object.defineProperty(obj, key, {
        enumerable: true, // 这里必须是可枚举的要不observable不好使
        get: () => {
          return this.store.execExpr(this.exprs[key]);
        },
        set: (expr) => {
          this.exprs[key] = UIStore.parseExpr(expr);
        }
      });
      return obj;
    }, {}));
  }

  toJS() {
    return {
      name: this.nameExpr.toString(),
      args: Object.keys(this.exprs).reduce((config, key) => {
        config[key] = this.exprs[key].toString();
        return config;
      }, {})
    }
  }

  static createSchema(config) {
    if (typeof config === 'string') {
      console.log('parse %s action...', config)
      return {
        type: Action,
        args: [UIStore.parseExpr(config)]
      };
    } else if (Array.isArray(config)) {
      return config.map(it => Action.createSchema(it));
    } else if (config) {
      console.log('parse %s action...', config.name)
      const {
        name,
        args,
        ...other
      } = config;
      const argobj = {
        ...other,
        ...args
      };
      return {
        type: Action,
        args: [UIStore.parseExpr(name), Object.keys(argobj).reduce((obj, key) => {
          obj[key] = UIStore.parseExpr(argobj[key]);
          return obj;
        }, {})]
      }
    } else {
      // 这里就是支持返回无行为
      return null;
    }
  }
}
