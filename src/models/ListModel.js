import {
  computed,
  observable,
  runInAction,
  action,
} from 'mobx';
import Model from './Model';

// 二维模型
export default class ListModel extends Model {


  constructor(store, {
   
    ...props
  }) {
    super(store, props);

  }
}
