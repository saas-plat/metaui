import {
  computed,
  observable,
  runInAction,
  action,
} from 'mobx';
import Model from './Model';
import SimpleModel from './SimpleModel';

// 二维模型
export default class ListModel extends Model {

  @observable data = [];

  constructor(store, {
    data = [],
    ...props
  }) {
    super(store, props);
    this.data = data.map(it => new SimpleModel(store, it));
  }
}
