import {
  computed,
  observable,
  runInAction,
  action,
} from 'mobx';
import Model from './Model';
import ObjectModel from './ObjectModel';

// 二维模型
export default class ListModel extends Model {
  @observable data;

  @computed get getValue() {
    return this.data.map(it=> it.getValue());
  }

  constructor(data) {
    super();
    this.data = data.map(cit => new ObjectModel(cit));
  }
}
