import {
  computed,
  observable,
  action,
} from 'mobx';
import Model from './Model';

// 容器模型，一般就是视图模板
export default class ContainerModel extends Model {

  @observable allitems;

  constructor(store, {
    items=[],
    ...props
  }) {
    super(store, {
      allitems:items,
      ...props
    });
  }

  @computed get items() {
    return this.allitems.filter(it => it.visible !== false)
  }

  @action addItem(...items) {
    this.allitems.push(...items);
  }

  @action removeItem(...names) {
    for (const name of names) {
      const allitems = this.allitems;
      const reit = allitems.find(it => it.name === name);
      if (reit) {
        allitems.splice(allitems.indexOf(reit), 1);
      } else {
        console.warn('uimodel items not exists!', name);
      }
    }
  }

  @action clearItems() {
    this.allitems.clear();
  }

}
