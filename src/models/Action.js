import {
  toJS,
  observable,
  computed,
  action,
} from "mobx";
import {
  assignId
} from './util';
import UIStore from '../UIStore';
import UISchema from '../UISchema';

export class Action {
  store;
  key;

  @observable nameExpr;
  @observable setNameExpr;
  @observable _args = observable.map();
  exprs = {};
  @observable getArgsExpr;
  @observable setArgsExpr;

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
    if (this.getArgs) {
      return this.store.execExpr(this.getArgs);
    }
    return this._args.toJSON();
  }

  @computed get setArgs() {
    return this.store.execExpr(this.setArgsExpr);
  }
  set setArgs(setValue) {
    this.setArgsExpr = UIStore.parseExpr(setValue);
    if (this._args.size > 0) {
      this.store.setViewModel(this.setargs, this._args.toJSON());
      this.clearArgs();
    }
  }

  @computed get getArgs() {
    return this.store.execExpr(this.getArgsExpr);
  }
  set getArgs(getValue) {
    this.getArgsExpr = UIStore.parseExpr(getValue);
    if (this._args.size > 0) {
      this.clearArgs();
    }
  }

  @action setArg(args) {
    if (this.setArgs) {
      return this.store.setViewModel(this.setargs, args);
    }
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
    if (this.setArgs) {
      const per = this.setargs;
      for (const name of names) {
        this.store.setViewModel(per + (per ? '.' : '') + name, undefined);
      }
      return
    }
    for (const name of names) {
      this._args.delete(name);
    }
  }

  @action clearArgs() {
    if (this.setArgs) {
      const per = this.setargs;
      const args = this.store.execExpr(per);
      const names = Object.keys(toJS(args));
      for (const name of names) {
        this.store.setViewModel(per + (per ? '.' : '') + name, undefined);
      }
      return
    }
    this._args.clear();
    this.exprs = {};
  }

  constructor(store, nameExpr, setNameExpr, getArgsExpr, setArgsExpr, args = {}) {
    this.key = assignId();
    this.store = store;
    this.nameExpr = nameExpr;
    this.setNameExpr = setNameExpr;
    this.getArgsExpr = getArgsExpr;
    this.setArgsExpr = setArgsExpr;
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

  static createSchema(config) {
    if (typeof config === 'string') {
      console.log('parse %s action...', config)
      return new UISchema(Action, UIStore.parseExpr(config), UIStore.parseExpr(null),
        UIStore.parseExpr(null), UIStore.parseExpr(null), {});
    } else if (Array.isArray(config)) {
      return config.map(it => Action.createSchema(it));
    } else if (config) {
      console.log('parse %s action...', config.name)
      const {
        name,
        setName,
        args,
        setArgs,
        getArgs,
        ...other
      } = config;
      const argobj = {
        ...other,
        ...args
      };
      return new UISchema(Action,
        UIStore.parseExpr(name), UIStore.parseExpr(setName),
        UIStore.parseExpr(getArgs), UIStore.parseExpr(setArgs),
        Object.keys(argobj).reduce((obj, key) => {
          obj[key] = UIStore.parseExpr(argobj[key]);
          return obj;
        }, {})
      )
    } else {
      // 这里就是支持返回无行为
      return null;
    }
  }
}
