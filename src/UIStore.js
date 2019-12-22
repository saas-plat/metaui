import {
  action,
  observable,
  runInAction
} from "mobx";
import Expression from 'saas-plat-expression';
import _set from 'lodash/set';
import _get from 'lodash/get';
import UISchema from './UISchema';

let tProvider = txt => txt;

export default class UIStore {

  static components = new Map();
  static models = new Map();

  // 数据级别的模型，前端的业务实体模型，包含状态和数据
  @observable model;
  // UI级别的模型，观察model
  @observable ui;

  constructor(model) {
    this.model = model;
    this.setValuable = typeof this.model.setValue === 'function';
    this.getValuable = typeof this.model.getValue === 'function';
  }

  // 组件是由扩展注册的，模型是统一的，交互可以是各端不同的
  static register(...items) {
    const registerOne = (type, Component, Model) => {
      if (!type) {
        console.error('ui type not be null!', type);
        return false;
      }
      if (!Component || !Model) {
        console.error('component model not be null!', type);
        return false;
      }
      if (UIStore.components.has(type.toLowerCase())) {
        console.error('component type has registerd!', type.toLowerCase());
        return false;
      }
      UIStore.components.set(type.toLowerCase(), Component);
      UIStore.models.set(type.toLowerCase(), Model);
      return true;
    }
    if (typeof items[0] === 'string') {
      return registerOne(...items);
    } else if (typeof items[0] === 'object') {
      const keys = Object.keys(items[0]);
      let hasFaield = false;
      for (const key of keys) {
        const it = items[0][key];
        if (Array.isArray(it)) {
          if (!registerOne(key, it[0], it[1])) {
            hasFaield = true;
          }
        } else {
          if (!registerOne(key, it.component, it.model)) {
            hasFaield = true;
          }
        }
      }
      return hasFaield;
    } else {
      let hasFaield = false;
      for (const it of items) {
        if (!registerOne(it.type || it.name, it.component, it.model)) {
          hasFaield = true;
        }
      }
      return hasFaield;
    }
  }

  static registerT(provider) {
    tProvider = provider;
  }

  t(txt) {
    return tProvider(txt);
  }

  @action setViewModel(path, value) {
    console.log('set view model', path, value);
    if (this.setValuable) {
      return this.model.setValue(path, value);
    }
    _set(this.model, path, value);
  }

  @action getViewModel(path) {
    console.log('get view model', path);
    if (this.getValuable) {
      return this.model.getValue(path);
    }
    _get(this.model, path);
  }

  static parseExpr(txt) {
    return new Expression(txt);
  }

  execExpr(expr) {
    return expr.exec(this.model);
  }

  map(obj, mapping) {
    if (!mapping) {
      return obj;
    }
    const expr = new Expression(mapping);
    // 这里是有个问题，要是调用了异步函数，这里需要await
    // 异步函数表达式还没有支持
    if (expr.tree) {
      return expr.exec(obj);
    } else {
      return {};
    }
  }

  build(node) {
    if (node instanceof UISchema) {
      console.log('create %s...', node.type);
      return node.createModel(this, it => this.build(it));
    } else if (Array.isArray(node)) {
      return node.map(it => this.build(it));
    } else {
      return node;
    }
  }

  static createSchema(config) {
    // 把配置信息解析成一棵构造树
    const schema = UISchema.createSchema(config);
    if (!schema) {
      console.error('not support ui type', config.type);
    }
    return schema;
  }

  static create(schema, data) {
    if (!(schema instanceof UISchema)) {
      schema = schema ? UIStore.createSchema(schema) : null;
      if (!schema) {
        console.error('not support ui schema', schema);
        return null;
      }
    }
    const store = new UIStore(data);
    const uiModel = store.build(schema);
    runInAction(() => {
      store.ui = uiModel;
    });
    return store;
  }

}
