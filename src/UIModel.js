import {
  action,
  observable,
  runInAction
} from "mobx";
import Expression from '@saas-plat/expression';
import _set from 'lodash/set';
import _get from 'lodash/get';
import _forOwn from 'lodash/forOwn';
import _mapValues from 'lodash/mapValues';
import UISchema from '../views';

export default class UIModel {

  // 数据级别的模型，前端的业务实体模型，包含状态和数据
  @observable model;
  // UI级别的模型，容器模型的树结构
  @observable ui;

  constructor(model) {
    if (model) {
      this.setModel(model);
    }
  }

  @action setViewModel(path, value) {
    console.log('set view model', path);
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
    return _get(this.model, path);
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

  createModel(store, schema, reducer) {
    let vm;
    // 这里不用考虑数组和对象情况，reducer里面处理啦
    const props = _mapValues(schema.props, reducer);
    // 这里要循环创建模型
    if (!schema.bind) {
      const Model = schema.model;
      vm = new Model(store, {
        ...props
      });
    } else {
      // bind的字段需要从vm中查找
      vm = store.getViewModel(schema.bind);
      if (!vm) {
        throw new Error(`"${schema.bind}" view model not found!`);
      }
      _forOwn({
        ...props
      }, (val, key) => {
        vm[key] = val;
      })
    }
    return vm;
  }

  build(node) {
    if (node instanceof UISchema) {
      console.log('create %s...', node.model.name);
      return this.createModel(this, node, it => this.build(it));
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

  static create(schema, vm = {}) {
    // UI的schema和VM的schema是不一样的
    // UISchema是模型的实例，UI是根据模型的实例渲染的UI组件
    if (!(schema instanceof UISchema)) {
      schema = schema ? UIModel.createSchema(schema) : null;
      if (!schema) {
        console.error('not support ui schema', schema);
        return null;
      }
    }
    const store = new UIModel(vm);
    const uiModel = store.build(schema);
    runInAction(() => {
      store.ui = uiModel;
    });
    return store;
  }

}
