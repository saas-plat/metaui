import {
  observable,
  computed,
  runInAction
} from "mobx";
import Expression from 'saas-plat-expression';
import _get from 'lodash/get';

export default class ViewStore {
  @observable _data;
  @observable viewModel;

  @computed get data() {
    return this._data || {};
  }

  constructor(data) {
    this._data = data;
  }

  @action setData(data) {
    this._data = data;
  }

  parseExpr(txt) {
    return new Expression(txt);
  }

  execExpr(expr) {
    return expr.exec(this.data);
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

  static registerTemplates(...items){

  }

  static register(...items) {
    const registerOne = (type, ViewItem) => {
      if (!type) {
        console.error('view type not be null!', type);
        return false;
      }
      if (!ViewItem) {
        console.error('view class not be null!', type);
        return false;
      }
      if (typeof ViewItem.create !== 'function') {
        console.error('view class can not be create!');
        return false;
      }
      if (ViewStore.models.has(type.toLowerCase())) {
        console.error('view type has registerd!', type.toLowerCase());
        return false;
      }
      ViewStore.models.set(type.toLowerCase(), ViewItem);
      return true;
    }
    if (typeof items[0] === 'string') {
      return registerOne(...items);
    } else if (typeof items[0] === 'object') {
      const keys = Object.keys(items[0]);
      let hasFaield = false;
      for (const key of keys) {
        if (!registerOne(key, items[0][key])) {
          hasFaield = true;
        }
      }
      return hasFaield;
    } else {
      let hasFaield = false;
      for (const it of items) {
        if (!registerOne(it.type || it.name, it.viewModel || it.view || it.model)) {
          hasFaield = true;
        }
      }
      return hasFaield;
    }
  }

  parse(obj) {
    const type = (obj.type || '').toLowerCase();
    const ViewItem = ViewStore.models.get(type);
    if (!ViewItem) {
      console.error('view class not be found!', type);
      return null;
    }
    const viewItem = ViewItem.create(this, obj);
    if (!viewItem) {
      console.error('view item create failed!', type);
      return null;
    }
    return viewItem;
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
      console.error('not support view type', obj.type);
    }
    return schema;
  }

  static create(schema, data) {
    const store = new ViewStore(data);
    const viewModel = store.build(schema);
    runInAction(() => {
      store.viewModel = viewModel;
    });
    return store;
  }
}
