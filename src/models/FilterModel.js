import {
  computed,
  observable,
  runInAction,
  action,
} from 'mobx';
import _keys from 'lodash/keys';
import Model from './Model';
import ObjectModel from './ObjectModel';
import ListModel from './ListModel';

// 查询方案模型，一个查询可以定义多个方案
export default class FilterModel extends Model{
  @observable searchitems;
  @observable plandata;

  constructor(searchitems = {}, plandata = []) {
    super();
    this.searchitems = _keys(searchitems).map(key => new ObjectModel({
      id: key,
      ...searchitems[key]
    }));
    this.plandata = plandata.map(it => new ListModel(it))
  }
}
