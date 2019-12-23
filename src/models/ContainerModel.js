import {
  computed,
  observable,
  action,
} from 'mobx';
import Model from './Model';

// 容器模型，一般就是视图模板
export default class ContainerModel extends Model {
  @observable allitems = [];

  constructor(store, {
    items = [],
    ...props
  }) {
    super(store, props);
    this.allitems = items;
  }

  @computed get items() {
    return this.allitems.filter(it => it.visible !== false)
  }

  @action addItem(...items) {
    this.allitems.push(...items);
  }

  @action removeItem(...names) {
    for (const name of names) {
      const reit = this.allitems.find(it => it.name === name);
      if (reit) {
        this.allitems.splice(this.allitems.indexOf(reit), 1);
      } else {
        console.warn('uimodel items not exists!', name);
      }
    }
  }

  @action clearItems() {
    this.allitems.clear();
  }
}
