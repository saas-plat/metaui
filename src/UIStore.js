import {
  action,
  observable,
  runInAction
} from "mobx";
import Expression from 'saas-plat-expression';
import jxon from 'jxon';
import _set from 'lodash/set';

let tProvider = txt => txt;

export default class UIStore {
  // 数据级别的模型，前端的业务实体模型，包含状态和数据
  @observable viewModel;
  // UI级别的模型，观察viewModel
  @observable ui;

  constructor(viewModel) {
    this.viewModel = viewModel;
    this.setValuable = typeof this.viewModel.setValue === 'function';
  }

  static registerT(provider) {
    tProvider = provider;
  }

  t(txt) {
    return tProvider(txt);
  }

  @action setViewModel(path, value) {
    if (this.setValuable) {
      return this.viewModel.setValue(path, value);
    }
    _set(this.viewModel, path, value);
  }

  static parseExpr(txt) {
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
      if (typeof Model.createSchema !== 'function') {
        console.error('model schema can not be create!');
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
        const {
          component,
          model
        } = items[0][key];
        if (!registerOne(key, component, model)) {
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

  build(node) {
    if (node && typeof node === 'object' && 'type' in node && 'args' in node) {
      console.log('create %s...', node.type.name);
      return new node.type(this, ...node.args.map(it => this.build(it)));
    } else if (Array.isArray(node)) {
      return node.map(it => this.build(it));
    } else {
      return node;
    }
  }

  static createSchema(obj = {}, options = {}) {
    // 把配置信息解析成一棵构造树
    const type = (obj.type || '').toLowerCase();
    const Model = UIStore.models.get(type);
    if (!Model) {
      console.error('ui model not found!', obj);
      return null;
    }
    const schema = Model.createSchema(obj, options);
    if (!schema) {
      console.error('not support ui model type', type);
    }
    return schema;
  }

  static create(schema, data) {
    const store = new UIStore(data);
    const uiModel = store.build(schema);
    runInAction(() => {
      store.ui = uiModel;
    });
    return store;
  }

  static loadJxon(strxml) {
    jxon.config({
      valueKey: 'text',
      // attrKey: '$',
      attrPrefix: '',
      // lowerCaseTags: false,
      // trueIsEmpty: false,
      // autoDate: false,
      // ignorePrefixedNodes: false,
      // parseValues: false
    })
    const formatNode = (node) => {
      if (node.parentNode && node.nodeType === 1) {
        // 节点名称是type类型
        const attr = node.ownerDocument.createAttribute('type');
        attr.value = node.nodeName;
        node.setAttributeNode(attr);
        // 所有子节点都是items数组
        node.nodeName = 'items';
      }
      if (node.hasChildNodes()) {
        for (let i = 0; i < node.childNodes.length; i++) {
          formatNode(node.childNodes.item(i));
        }
      }
      return node;
    }

    var xml = jxon.stringToXml(strxml);
    formatNode(xml.documentElement);
    return jxon.xmlToJs(xml).items;
  }
}
