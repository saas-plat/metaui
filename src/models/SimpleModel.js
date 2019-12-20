import {
  extendObservable,
} from 'mobx';
import Model from './Model';

// 一维模型
export default class SimpleModel extends Model {

  constructor(store, props) {
    super(store, props);
    delete props.name;
    // 必须要有value
    props.value = null;
    extendObservable(this, props);
  }

}
