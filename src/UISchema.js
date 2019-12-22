import _mapValues from 'lodash/mapValues';
import _isPlanObject from 'lodash/isPlanObject';
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
    const props = _mapValues(this.props, reducer);
    if (!this.bind) {
      const Model = UIStore.models.get(this.type);
      vm = new Model(store, {
        type: this.type,
        ...props
      });
    } else {
      vm = store.getViewModel(this.bind);
      vm.setValue({
        type: this.type,
        ...props
      });
    }
    return vm;
  }

  static createSchema(obj) {
    let {
      key, //  系统关键字
      store, //  系统关键字
      type,
      bind,
      ...props
    } = obj;
    if (!type) {
      return obj;
    }
    props = _mapValues(props, v => {
      if (_isPlanObject(v)) {
        return UISchema.createSchema(v);
      } else if (_isArray(v)) {
        return v.map(UISchema.createSchema);
      } else {
        return v
      }
    });

// 暂时取消所有字段都是expr类型，必须type=expression才行
    // 支持表达式
    // props = _mapValues(props, (val) => {
    //   let expr = UIStore.parseExpr(val);
    //   Object.defineProperty(props, key, {
    //     enumerable: true, // 这里必须是可枚举的要不observable不好使
    //     get: () => {
    //       return this.store.execExpr(expr);
    //     },
    //     set: (val) => {
    //       expr = UIStore.parseExpr(val);
    //     }
    //   });
    // })

    return new UISchema(type, bind, props);
  }
}
