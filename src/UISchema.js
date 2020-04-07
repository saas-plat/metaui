import _mapValues from 'lodash/mapValues';
import _isArray from 'lodash/isArray';
import _forOwn from 'lodash/forOwn';
import UIStore from './UIStore';

export default class UISchema {
  model;
  bind;
  props;

  constructor(model, bind, props) {
    this.model = model;
    this.bind = bind;
    this.props = props;
  }

  createModel(store, reducer) {
    let vm;
    // 这里不用考虑数组和对象情况，reducer里面处理啦
    const props = _mapValues(this.props, reducer);
    // 这里要循环创建模型
    if (!this.bind) {
      const Model = this.model;
      vm = new Model(store, {
        ...props
      });
    } else {
      // bind的字段需要从vm中查找
      vm = store.getViewModel(this.bind);
      if (!vm) {
        throw new Error(`"${this.bind}" view model not found!`);
      }
      _forOwn({
        ...props
      }, (val, key) => {
        vm[key] = val;
      })
    }
    return vm;
  }

  static createSchema(obj) {
    let {
      // key, //  系统关键字排除
      // store, //  系统关键字
      type,
      bind,
      ...props
    } = obj;

    if (!type) {
      return obj;
    }

    const Model = UIStore.models.get(type);
    if (!Model) {
      throw new Error(`"${type}" ui model not found!`);
    }

    props = _mapValues(props, v => {
      if (_isArray(v)) {
        return v.map(UISchema.createSchema);
      } else if (v) {
        return UISchema.createSchema(v);
      } else {
        return v;
      }
    });

    return new UISchema(Model, bind, {
      type,
      ...props
    });
  }
}
