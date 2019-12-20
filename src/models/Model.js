import {
  readonly
} from 'core-decorators';
import { 
  extendObservable
} from 'mobx';

let gid = 0;
// 分配全局id
const assignId = (pre) => {
  // 每次加一
  gid = gid + 1;
  return (pre || '') + gid;
}

// 视图模型基类
export default class Model {
  @readonly store;
  @readonly key;
  @readonly name;

  constructor(store, {
    name,
    ...props
  }) {
    const key = assignId(name);
    this.store = store;
    this.key = key;
    this.name = name || key;

    // 可以定义容器属性
    extendObservable(this, props);
  }

}
