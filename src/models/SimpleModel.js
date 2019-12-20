import {
  observable,
} from 'mobx';
import Model from './Model';

// 一维模型
export default class SimpleModel extends Model {

  // 有个值对象
  @observable value;

  constructor(store, {
    value,
    ...props
  }) {
    super(store, props);
    this.value = value;
  }

}
