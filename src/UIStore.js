import {
  observable,
  computed,
  runInAction
} from "mobx";
import Expression from 'saas-plat-expression';
import _get from 'lodash/get';

export default class UIStore {
  // 数据级别的模型，前端的业务实体模型，包含状态和数据
  @observable viewModel;
  // UI级别的模型，观察viewModel
  @observable uiModel;

  constructor(viewModel) {
    this.viewModel = viewModel;
  }

  @action setViewModel(viewModel) {
    this.viewModel = viewModel;
  }

  parseExpr(txt) {
    return new Expression(txt);
  }

  execExpr(expr) {
    return expr.exec(this.viewModel);
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

  static models = new Map();
  static components = new Map();

  static register(...items) {
    const registerOne = (type, Component, Model) => {
      if (!type) {
        console.error('ui type not be null!', type);
        return false;
      }
      if (!Model) {
        console.error('model type not be null!', type);
        return false;
      }
      if (!Component) {
        console.error('component type not be null!', type);
        return false;
      }
      if (typeof Model.create !== 'function') {
        console.error('model class can not be create!');
        return false;
      }
      if (UIStore.models.has(type.toLowerCase())) {
        console.error('model type has registerd!', type.toLowerCase());
        return false;
      }
      if (UIStore.components.has(type.toLowerCase())) {
        console.error('component type has registerd!', type.toLowerCase());
        return false;
      }
      UIStore.models.set(type.toLowerCase(), Model);
      UIStore.components.set(type.toLowerCase(), Component);
      return true;
    }
    if (typeof items[0] === 'string') {
      return registerOne(...items);
    } else if (typeof items[0] === 'object') {
      const keys = Object.keys(items[0]);
      let hasFaield = false;
      for (const key of keys) {
        const {component,model} = items[0][key];
        if (!registerOne(key, component,model)) {
          hasFaield = true;
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

  parse(obj) {
    const type = (obj.type || '').toLowerCase();
    const Model = UIStore.models.get(type);
    if (!Model) {
      console.error('ui model not be found!', type);
      return null;
    }
    const uiModel = Model.create(this, obj);
    if (!uiModel) {
      console.error('ui model create failed!', type);
      return null;
    }
    return uiModel;
  }

  build(node) {
    if ('type' in node && 'args' in node) {
      return new node.type(this, ...node.args.map(it => this.build(store, it)));
    } else {
      return node;
    }
  }

  static createSchema(obj = {}) {
    // 把配置信息解析成一棵构造树
    const schema = this.parse(obj);
    if (!schema) {
      console.error('not support ui model type', obj.type);
    }
    return schema;
  }

  static create(schema, data) {
    const store = new UIStore(data);
    const uiModel = store.build(schema);
    runInAction(() => {
      store.uiModel = uiModel;
    });
    return store;
  }
}
