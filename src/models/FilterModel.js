import {
  computed,
  observable,
  runInAction,
  action,
} from 'mobx';
import _keys from 'lodash/keys';
import Model from './Model';
import SimpleModel from './SimpleModel';
import ListModel from './ListModel';

// 查询方案模型，一个查询可以定义多个方案
export default class FilterModel extends Model {
  @observable searchitems;
  @observable searchplans;

  constructor(store, {
    searchitems = {},
    searchplans = [],
    ...props
  }) {
    super(store, props);
    this.searchitems = _keys(searchitems).map(key => new SimpleModel(store, {
      id: key,
      ...searchitems[key]
    }));
    this.searchplans = searchplans.map(it => new ListModel(store, it))
  }
}
