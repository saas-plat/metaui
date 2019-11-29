import {
  observable,
  computed
}
from "mobx";
import {
  assignId
} from './util';
import {
  Action
} from './Action';
import UIStore from '../UIStore';
import UISchema from '../UISchema';

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

  // primary secondary success  danger warning info | light  dark | ghost dashed link
  @observable styleExpr;
  @observable setStyleExpr;
  @observable loadingExpr;
  @observable setLoadingExpr;

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

  @computed get style() {
    return this.store.execExpr(this.styleExpr);
  }
  set style(value) {
    if (this.setStyle) {
      return this.store.setViewModel(this.setStyle, value);
    }
    this.styleExpr = UIStore.parseExpr(value);
  }
  @computed get setStyle() {
    return this.store.execExpr(this.setStyleExpr);
  }
  set setStyle(setValue) {
    this.setStyleExpr = UIStore.parseExpr(setValue);
  }

  @computed get loading() {
    return this.store.execExpr(this.loadingExpr);
  }
  set loading(value) {
    if (this.setLoading) {
      return this.store.setViewModel(this.setLoading, value);
    }
    this.loadingExpr = UIStore.parseExpr(value);
  }
  @computed get setLoading() {
    return this.store.execExpr(this.setLoadingExpr);
  }
  set setLoading(setValue) {
    this.setLoadingExpr = UIStore.parseExpr(setValue);
  }

  constructor(store, name, typeExpr, setTypeExpr,
    textExpr, setTextExpr, iconExpr, setIconExpr,
    styleExpr, setStyleExpr, loadingExpr, setLoadingExpr,
    disableExpr, setDisableExpr, visibleExpr, setVisibleExpr, onClick, items) {
    this.key = assignId('Button');
    this.store = store;
    this.name = name || this.key;

    this.typeExpr = typeExpr;
    this.setTypeExpr = setTypeExpr;
    this.textExpr = textExpr;
    this.setTextExpr = setTextExpr;
    this.iconExpr = iconExpr;
    this.setIconExpr = setIconExpr;

    this.styleExpr = styleExpr;
    this.setStyleExpr = setStyleExpr;
    this.loadingExpr = loadingExpr;
    this.setLoadingExpr = setLoadingExpr;

    this.disableExpr = disableExpr;
    this.setDisableExpr = setDisableExpr;
    this.visibleExpr = visibleExpr;
    this.setVisibleExpr = setVisibleExpr;

    this.allitems = items;

    this.onClick = onClick;
  }

  static createSchema(config) {
    console.log('parse %s button item...', config.name)
    return new UISchema(Button,
      config.name || config.type,
      UIStore.parseExpr(config.type), UIStore.parseExpr(config.setType),
      UIStore.parseExpr(config.text), UIStore.parseExpr(config.setText),
      UIStore.parseExpr(config.icon), UIStore.parseExpr(config.setIcon),
      UIStore.parseExpr(config.style), UIStore.parseExpr(config.setStyle),
      UIStore.parseExpr(config.loading), UIStore.parseExpr(config.setLoading),
      UIStore.parseExpr(config.disable || false), UIStore.parseExpr(config.setDisable),
      UIStore.parseExpr(config.visible || true), UIStore.parseExpr(config.setVisible),
      Action.createSchema(config.onClick),
      (config.items || []).map(it => Button.createSchema(it))
    );
  }
}
