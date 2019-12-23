import _mapValues from 'lodash/mapValues';
import _isArray from 'lodash/isArray';
import UIStore from './UIStore';

export default class UISchema {
  type;
  bind;
  props;

  constructor(type, bind, props) {
    this.type = type;
    this.bind = bind;
    this.props = props;
  }

  createModel(store, reducer) {
    let vm;
    // 这里不用考虑数组和对象情况，reducer里面处理啦
    const props = _mapValues(this.props, reducer);
    // 这里要循环创建模型
    if (!this.bind) {
      const Model = UIStore.models.get(this.type);
      if (!Model) {
        throw new Error(`"${this.type}" ui model not found!`);
      }
      vm = new Model(store, {
        type: this.type,
        ...props
      });
    } else {
      // bind的字段需要从vm中查找
      vm = store.getViewModel(this.bind);
      if (!vm) {
        throw new Error(`"${this.bind}" view model not found!`);
      }
      if (typeof vm.setProps !== 'function'){
        throw new Error(`"${this.bind}" object not view model!`);
      }
      vm.setProps({
        type: this.type,
        ...props
      });
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

    // 对所有属性都需要判断模型类型
    props = _mapValues(props, v => {
      if (_isArray(v)) {
        return v.map(UISchema.createSchema);
      } else {
        return UISchema.createSchema(v);
      }
    });

    return new UISchema(type, bind, props);
  }
}
