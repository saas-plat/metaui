import {
  observable,
  computed
} from "mobx";
import {
  assignId
} from './util';
import {
  Action
} from './Action';

export class Item {
  store;
  key;

  @observable name;
  @observable textExpr;
  @observable iconExpr;
  @observable disableExpr;
  @observable visibleExpr;
  @observable onClick;

  @observable allitems;

  @computed get items(){
    return this.allitems.filter(it=>it.visible);
  }

  get type(){
    return 'item';
  }

  @computed get disable() {
    return this.store.execExpr(this.disableExpr);
  }
  @computed get visible() {
    return this.store.execExpr(this.visibleExpr);
  }

  @computed get state() {
    return this.store.state;
  }

  @computed get text() {
    return this.store.execExpr(this.textExpr);
  }
  set text(textExpr) {
    this.textExpr = this.store.parseExpr(textExpr);
  }
  @computed get icon() {
    return this.store.execExpr(this.iconExpr);
  }
  set icon(iconExpr) {
    this.iconExpr = this.store.parseExpr(iconExpr);
  }

  constructor(store, name, text, icon, disableExpr = false, visibleExpr = true, onClick, items = []) {
    this.key = assignId();
    this.store = store;
    this.name = name || 'Item' + this.key;
    this.textExpr = this.store.parseExpr(text);
    this.iconExpr = this.store.parseExpr(icon);
    this.disableExpr = store.parseExpr(disableExpr);
    this.visibleExpr = store.parseExpr(visibleExpr);
    this.onClick = onClick;
    this.allitems = items;
  }

  static create(store, obj) {
    return new Item(store, obj.name, obj.text, obj.icon,  obj.disable, obj.visible, Action.create(store, obj.onClick), obj.items && obj.items.map(it => Item.create(store, it)));
  }
}

class ItemGroup {
  store;
  key;

  @observable allitems;
  @observable pull;

  get type(){
    return 'itemGroup';
  }

  @computed get items(){
    return this.allitems.filter(it=>it.visible);
  }

  constructor(store, pull = 'right', items = []) {
    this.key = assignId();
    this.store = store;
    this.pull = pull;
    this.allitems = items;
  }

  static create(store, obj = {}) {
    return new ItemGroup(store, store.pull, obj.items && obj.items.map(it => Item.create(store, it)));
  }
}

export class Toolbar {
  store;
  key;
  type;

  @observable allgroups;
  @observable textExpr;

  @observable disableExpr;
  @observable visibleExpr;

  @computed get groups(){
    return this.allgroups.filter(it=>it.items.length>0);
  }

  @computed get disable() {
    return this.store.execExpr(this.disableExpr);
  }
  @computed get visible() {
    return this.store.execExpr(this.visibleExpr);
  }

  @computed get text() {
    return this.store.execExpr(this.textExpr);
  }
  set text(textExpr) {
    this.textExpr = this.store.parseExpr(textExpr);
  }

  constructor(store, type, text, disableExpr = false, visibleExpr = true, groups = []) {
    this.key = assignId();
    this.store = store;
    this.type = type;
    this.textExpr = this.store.parseExpr(text);
    this.allgroups = groups;
    this.disableExpr = store.parseExpr(disableExpr);
    this.visibleExpr = store.parseExpr(visibleExpr);
  }

  static create(store, obj = {}) {
    let groups;
    if (obj.groups) {
      groups = obj.groups;
    } else if (obj.items) {
      groups = [{
        items: obj.items
      }];
    } else {
      groups = [];
    }
    return new Toolbar(store, obj.type, obj.text, obj.disable, obj.visible, groups.map(it => ItemGroup.create(store, it)));
  }
}
