import {
  computed,
  observable,
  runInAction,
  action,
} from 'mobx'; 
import Model from './Model';

// 查询方案模型，一个查询可以定义多个方案
export default class FilterModel extends Model {
  @observable searchitems;
  @observable searchplans;

  constructor(store, {
    searchitems,
    searchplans,
    ...props
  }) {
    super(store, props);
    this.searchitems = Model.createProp(store, searchitems || []);
    this.searchplans = Model.createProp(store, searchplans || []);
  }
}
