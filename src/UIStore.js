import {
  action,
  observable,
  runInAction
} from "mobx";
import Expression from 'saas-plat-expression';
import _set from 'lodash/set';
import UISchema from './UISchema';

// common
import {
  Action as ActionModel
} from './models/Action';
import {
  Container as ContainerModel
} from './models/Container';

//  input
import {
  Button as ButtonModel
} from './models/Button';
import {
  Input as InputModel
} from './models/Input';
import {
  EditTable as EditTableModel,
  EditColumn as EditColumnModel,
  EditCell as EditCellModel
} from './models/EditTable';
import {
  Form as FormModel,
  FormItem as FormItemModel,
  Rule as RuleModel
} from './models/Form';

// display
import {
  Filter as FilterModel
} from './models/Filter';
import {
  Table as TableModel,
  Column as ColumnModel,
  Cell as CellModel
} from './models/Table';
import {
  Chart as ChartModel
} from './models/Chart';

let tProvider = txt => txt;

export default class UIStore {
  static models = new Map({
    // common
    ActionModel,
    ContainerModel,

    //  input
    ButtonModel,
    InputModel,
    EditTableModel,
    EditColumnModel,
    EditCellModel,
    FormModel,
    FormItemModel,
    RuleModel,

    // display
    FilterModel,
    TableModel,
    ColumnModel,
    CellModel,
    ChartModel,
  });
  static components = new Map();

  // 数据级别的模型，前端的业务实体模型，包含状态和数据
  @observable viewModel;
  // UI级别的模型，观察viewModel
  @observable ui;

  constructor(viewModel) {
    this.viewModel = viewModel;
    this.setValuable = typeof this.viewModel.setValue === 'function';
  }

  // 组件是由扩展注册的，模型是统一的，交互可以是各端不同的
  static register(...items) {
    const registerOne = (type, Component) => {
      if (!type) {
        console.error('ui type not be null!', type);
        return false;
      }
      if (!Component) {
        console.error('component type not be null!', type);
        return false;
      }
      if (UIStore.components.has(type.toLowerCase())) {
        console.error('component type has registerd!', type.toLowerCase());
        return false;
      }
      UIStore.components.set(type.toLowerCase(), Component);
      return true;
    }
    if (typeof items[0] === 'string') {
      return registerOne(...items);
    } else if (typeof items[0] === 'object') {
      const keys = Object.keys(items[0]);
      let hasFaield = false;
      for (const key of keys) {
        const component = items[0][key];
        if (!registerOne(key, component)) {
          hasFaield = true;
        }
      }
      return hasFaield;
    } else {
      let hasFaield = false;
      for (const it of items) {
        if (!registerOne(it.type || it.name, it.component)) {
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

  build(node) {
    if (node instanceof UISchema) {
      console.log('create %s...', node.type.name);
      return new node.type(this, ...node.args.map(it => this.build(it)));
    } else if (Array.isArray(node)) {
      return node.map(it => this.build(it));
    } else {
      return node;
    }
  }

  static createSchema(obj = {}) {
    // 把配置信息解析成一棵构造树
    const Model = UIStore.models.get(obj.model);
    if (!Model) {
      console.error('ui model not found!', obj);
      return null;
    }
    const schema = Model.createSchema(obj);
    if (!schema) {
      console.error('not support ui type', obj.type);
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
