import {
  observable,
  computed,
  action
} from "mobx";
import {
  Button
} from './Button';
import UIStore from '../UIStore';
import {
  assignId
} from './util';

// 容器模型，包含一组不断递归的结构，每层有一个布局方式
export class Container {
  store;
  key;
  name;

  @observable typeExpr;
  // 一般显示标题等信息
  @observable textExpr;
  @observable descriptionExpr;
  @observable iconExpr;
  @observable disableExpr;
  @observable visibleExpr;

  // 子容器或者items的布局方式
  @observable layoutExpr; // grid flow list
  @observable spanExpr; // gridlayout时列数
  @observable itemWidthExpr; // flowlayout每项宽度

  // 子容器集合
  @observable allcontainers;
  // 容器包含的输入项集合
  @observable allitems;
  // 每个容器可以包含一组按钮行为
  @observable allbtns;

  @computed get layout() {
    return this.store.execExpr(this.layoutExpr);
  }
  set layout(layoutExpr) {
    this.layoutExpr = this.store.parseExpr(layoutExpr);
  }
  @computed get itemWidth() {
    return parseFloat(this.store.execExpr(this.itemWidthExpr)) || 360;
  }
  set itemWidth(itemWidthExpr) {
    this.itemWidthExpr = this.store.parseExpr(itemWidthExpr);
  }

  @computed get span() {
    if (this.layout === 'list') {
      return 1;
    }
    const count = parseInt(this.store.execExpr(this.spanExpr));
    return count !== 0 ? (count || 4) : count;
  }
  set span(spanExpr) {
    this.spanExpr = this.store.parseExpr(spanExpr);
  }
  @computed get items() {
    return this.allitems.filter(it => it.visible);
  }
  @computed get containers() {
    return this.allcontainers.filter(it => it.visible);
  }
  @computed get btns() {
    return this.allbtns.filter(it => it.visible);
  }

  @computed get type() {
    return this.store.execExpr(this.typeExpr);
  }
  set type(typeExpr) {
    this.typeExpr = this.store.parseExpr(typeExpr);
  }

  @computed get text() {
    return this.store.execExpr(this.textExpr);
  }
  set text(textExpr) {
    this.textExpr = this.store.parseExpr(textExpr);
  }
  @computed get description() {
    return this.store.execExpr(this.descriptionExpr);
  }
  set description(descriptionExpr) {
    this.descriptionExpr = this.store.parseExpr(descriptionExpr);
  }
  @computed get icon() {
    return this.store.execExpr(this.iconExpr);
  }
  set icon(iconExpr) {
    this.iconExpr = this.store.parseExpr(iconExpr);
  }
  @computed get disable() {
    return this.store.execExpr(this.disableExpr);
  }
  set disable(disableExpr) {
    this.disableExpr = this.store.parseExpr(disableExpr);
  }
  @computed get visible() {
    return this.store.execExpr(this.visibleExpr);
  }
  set visible(visibleExpr) {
    this.visibleExpr = this.store.parseExpr(visibleExpr);
  }

  constructor(store, name, type, text, description, icon, disableExpr, visibleExpr = true,
    layout, spanExpr, itemWidthExpr, containers = [], items = [], btns = []) {
    this.key = assignId('Container');
    this.store = store;
    this.name = name || this.key;
    this.typeExpr = this.store.parseExpr(type);
    this.textExpr = this.store.parseExpr(text);
    this.descriptionExpr = this.store.parseExpr(description);
    this.iconExpr = this.store.parseExpr(icon);
    this.disableExpr = store.parseExpr(disableExpr);
    this.visibleExpr = store.parseExpr(visibleExpr);
    this.allcontainers = containers;
    this.allitems = items;
    this.allbtns = btns;

    this.layoutExpr = store.parseExpr(layout);
    this.spanExpr = store.parseExpr(spanExpr);
    this.itemWidthExpr = store.parseExpr(itemWidthExpr);
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
        console.warn('container items not exists!', name);
      }
    }
  }

  @action clearItems() {
    this.allitems.clear();
  }

  @action addContainer(...items) {
    this.allcontainers.push(...items);
  }

  @action removeContainer(...names) {
    for (const name of names) {
      const reit = this.allcontainers.find(it => it.name === name);
      if (reit) {
        this.allcontainers.splice(this.allcontainers.indexOf(reit), 1);
      } else {
        console.warn('sub container not exists!', name);
      }
    }
  }

  @action clearContainers() {
    this.allcontainers.clear();
  }

  @action addButton(...items) {
    this.allbtns.push(...items);
  }

  @action removeButton(...names) {
    for (const name of names) {
      const reit = this.allbtns.find(it => it.name === name);
      if (reit) {
        this.allbtns.splice(this.allbtns.indexOf(reit), 1);
      } else {
        console.warn('sub container not exists!', name);
      }
    }
  }

  @action clearButtons() {
    this.allbtns.clear();
  }

  static createSchema(obj, options = {}) {
    console.log('create %s container...', obj.name || obj.type)
    let containers = obj.containers || [];
    let items = [];
    if (obj.items) {
      items.push(...obj.items);
    } else if (!obj.containers) {
      // 注意这里会死循环，要是有子容器就不算items
      items.push(obj)
    }
    return {
      type: Container,
      args: [
        obj.name, obj.type, obj.title || obj.text, obj.description, obj.icon, obj.disable || false, obj.visible || true,
        obj.layout || 'flow', obj.span, obj.itemWidth,
        containers.map(it => Container.createSchema(it, options)),
        items.map(it => UIStore.createSchema(it, options)),
        (obj.btns || []).map(it => Button.createSchema(it, options))
      ]
    };
  }
}
