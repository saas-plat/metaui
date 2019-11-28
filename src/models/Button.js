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
import UIStore from '../UIStore';

// 行为按钮模型，可以表示按钮或者菜单等能触发action的对象
export class Button {
  store;
  key;
  name;

  @observable textExpr;
  @observable setTextExpr;
  @observable iconExpr;
  @observable setIconExpr;
  @observable disableExpr;
  @observable setDisableExpr;
  @observable visibleExpr;
  @observable setVisibleExpr;
  @observable typeExpr;
  @observable setTypeExpr;
  // 按钮也支持子按钮集合
  @observable allitems;

  @observable onClick;

  @computed get items() {
    return this.allitems.filter(it => it.visible);
  }

  @computed get type() {
    return this.store.execExpr(this.typeExpr);
  }
  set type(value) {
    if (this.setType) {
      return this.store.setViewModel(this.setType, value);
    }
    this.typeExpr = UIStore.parseExpr(value);
  }
  @computed get setType() {
    return this.store.execExpr(this.setTypeExpr);
  }
  set setType(setValue) {
      this.setTypeExpr = UIStore.parseExpr(setValue);
  }

  @computed get disable() {
    return this.store.execExpr(this.disableExpr);
  }
  set disable(value) {
    if (this.setDisable) {
      return this.store.setViewModel(this.setDisable, value);
    }
    this.disableExpr = UIStore.parseExpr(value);
  }
  @computed get setDisable() {
    return this.store.execExpr(this.setDisableExpr);
  }
  set setDisable(setValue) {
      this.setDisableExpr = UIStore.parseExpr(setValue);
  }
  @computed get visible() {
    return this.store.execExpr(this.visibleExpr);
  }
  set visible(value) {
    if (this.setVisible) {
      return this.store.setViewModel(this.setVisible, value);
    }
    this.visibleExpr = UIStore.parseExpr(value);
  }
  @computed get setVisible() {
    return this.store.execExpr(this.setVisibleExpr);
  }
  set setVisible(setValue) {
      this.setVisibleExpr = UIStore.parseExpr(setValue);
  }

  @computed get text() {
    return this.store.execExpr(this.textExpr);
  }
  set text(value) {
    if (this.setText) {
      return this.store.setViewModel(this.setText, value);
    }
    this.textExpr = UIStore.parseExpr(value);
  }
  @computed get setText() {
    return this.store.execExpr(this.setTextExpr);
  }
  set setText(setValue) {
      this.setTextExpr = UIStore.parseExpr(setValue);
  }
  @computed get icon() {
    return this.store.execExpr(this.iconExpr);
  }
  set icon(value) {
    if (this.setIcon) {
      return this.store.setViewModel(this.setIcon, value);
    }
    this.iconExpr = UIStore.parseExpr(value);
  }
  @computed get setIcon() {
    return this.store.execExpr(this.setIconExpr);
  }
  set setIcon(setValue) {
      this.setIconExpr = UIStore.parseExpr(setValue);
  }

  constructor(store, name, type, text, icon, disableExpr = false, visibleExpr = true, onClick, items = []) {
    this.key = assignId('Button');
    this.store = store;
    this.name = name || this.key;

    this.typeExpr = type;
    this.textExpr = text;
    this.iconExpr = icon;
    this.disableExpr = disableExpr;
    this.visibleExpr = visibleExpr;

    this.allitems = items;

    this.onClick = onClick;
  }

  static createSchema(config) {
    console.log('parse %s button item...', config.name)
    return {
      type: Button,
      args: [config.name || config.type, UIStore.parseExpr(config.type || 'button'),
        UIStore.parseExpr(config.text), UIStore.parseExpr(config.icon),
        UIStore.parseExpr(config.disable), UIStore.parseExpr(config.visible),
        Action.createSchema(config.onClick),
        config.items && config.items.map(it => Button.createSchema(it))
      ]
    };
  }
}
