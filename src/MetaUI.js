import {
  action,
  observable,
  runInAction
} from "mobx";
import Expression from '@saas-plat/expression';
import set from 'lodash/set';
import get from 'lodash/get';
import forOwn from 'lodash/forOwn';
import mapValues from 'lodash/mapValues';
import isArray from 'lodash/isArray';
import i18n from './i18n';
const debug = require('debug')('saas-plat:MetaUI');

class UINode {
  constructor(Model, bind, props) {
    this.model = Model;
    this.bind = bind;
    this.props = props;
  }
}

export default class MetaUI {

  static components = new Map();
  static models = new Map();

  // 数据级别的模型，前端的业务实体模型，包含状态和数据
  @observable model;
  // UI级别的模型，容器模型的树结构, 直接由树结构创建没有schema只有一个实例
  @observable ui;

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
      if (MetaUI.components.has(type.toLowerCase())) {
        console.error('component type has registerd!', type.toLowerCase());
        return false;
      }
      MetaUI.components.set(type.toLowerCase(), Component);
      MetaUI.models.set(type.toLowerCase(), Model);
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

  constructor(model) {
    if (model) {
      this.setModel(model);
    }
  }

  @action setViewModel(path, value) {
    debug('set view model', path);
    if (this.setValuable) {
      return this.model.setValue(path, value);
    }
    set(this.model, path, value);
  }

  @action getViewModel(path) {
    debug('get view model', path);
    if (this.getValuable) {
      return this.model.getValue(path);
    }
    return get(this.model, path);
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

  @action setModel(model) {
    this.model = model;
    this.setValuable = typeof this.model.setValue === 'function';
    this.getValuable = typeof this.model.getValue === 'function';
  }

  @action setUI(view) {
    this.ui = view;
  }

  createModel(store, uimodel, reducer) {
    let vm;
    // 这里不用考虑数组和对象情况，reducer里面处理啦
    const props = mapValues(uimodel.props, reducer);
    // 这里要循环创建模型
    if (!uimodel.bind) {
      const Model = uimodel.model;
      vm = new Model(store, {
        ...props
      });
    } else {
      // bind的字段需要从vm中查找
      vm = store.getViewModel(uimodel.bind);
      if (!vm) {
        throw new Error(`"${uimodel.bind}" view model not found!`);
      }
      forOwn({
        ...props
      }, (val, key) => {
        vm[key] = val;
      })
    }
    return vm;
  }

  build(node) {
    if (node instanceof UINode) {
      debug('create %s...', node.model.name);
      return this.createModel(this, node, it => this.build(it));
    } else if (Array.isArray(node)) {
      return node.map(it => this.build(it));
    } else {
      return node;
    }
  }

  static loadModel({
    type,
    bind,
    ...props
  }) {
    if (!type) {
      throw new Error(i18n.t('组件无效'));
    }
    // 把配置信息解析成一棵构造树
    const Model = MetaUI.models.get(type);
    if (!Model) {
      throw new Error(i18n.t('"{{type}}"组件未知', {
        type
      }));
    }

    props = mapValues(props, v => {
      if (isArray(v)) {
        return v.map((v) => v.type ? MetaUI.loadModel(v) : v);
      } else if (v) {
        return v.type ? MetaUI.loadModel(v) : v;
      } else {
        return v;
      }
    });

    props.type = type;
    return new UINode(Model, bind, props);
  }

  static create(template, vm = {}) {
    if (!template) {
      throw new Error(i18n.t('视图模板未定义'));
    }
    // UI的model和VM的uimodel是不一样的
    // View是模型的实例，UI是根据模型的实例渲染的UI组件
    const uimodel = MetaUI.loadModel(template.root);
    const store = new MetaUI(vm);
    const uiModel = store.build(uimodel);
    runInAction(() => {
      store.ui = uiModel;
    });
    return store;
  }

}
