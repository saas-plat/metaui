import {
  computed,
  observable,
  action,
} from 'mobx';
import {
  readonly
} from 'core-decorators';
import Model from './Model';

// 容器模型，一般就是视图模板
export default class ContainerModel extends Model {
  @readonly type;
  @observable allitems = [];

  constructor(store, {
    items = [],
    type,
    ...props
  }) {
    super(store, props);
    this.type = type;
    this.allitems = items;
  }

  @computed get items() {
    return this.allitems.filter(it => it.visible)
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
