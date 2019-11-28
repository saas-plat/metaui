import {
  observable,
  computed
} from "mobx";
import {
  assignId
} from './util';
import UIStore from '../UIStore';

class Style {
  store;
  key;

  name;
  @observable heightExpr;
  @observable setHeightExpr;
  @observable widthExpr;
  @observable setWidthExpr;

  @computed get height() {
    return this.store.execExpr(this.heightExpr);
  }

  set height(value) {
    if (this.setHeight) {
      return this.store.setViewModel(this.setHeight, value);
    }
    this.heightExpr = UIStore.parseExpr(value);
  }
  @computed get setHeight() {
    return this.store.execExpr(this.setHeightExpr);
  }
  set setHeight(setValue) {
      this.setHeightExpr = UIStore.parseExpr(setValue);
  }

  @computed get width() {
    return this.store.execExpr(this.widthExpr);
  }

  set width(value) {
    if (this.setWidth) {
      return this.store.setViewModel(this.setWidth, value);
    }
    this.widthExpr = UIStore.parseExpr(value);
  }
  @computed get setWidth() {
    return this.store.execExpr(this.setWidthExpr);
  }
  set setWidth(setValue) {
      this.setWidthExpr = UIStore.parseExpr(setValue);
  }

  constructor(store, name, heightExpr = '300', widthExpr = '100%') {

    this.key = assignId('Style');
    this.store = store;
    this.name = name || this.key;

    this.heightExpr = heightExpr;
    this.widthExpr = widthExpr;
  }

  static createSchema(config = {}) {
    return {
      type: Style,
      args: [config.name || config.type, UIStore.parseExpr(config.height), UIStore.parseExpr(config.width)]
    };
  }
}

export class Chart {
  store;
  key;

  name;
  @observable typeExpr;
  @observable setTypeExpr;
  @observable style;


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

  constructor(store, name, typeExpr, style) {

    this.key = assignId('Chart');
    this.store = store;
    this.name = name || this.key;

    this.typeExpr = typeExpr;
    this.style = style;
  }

  static createSchema(config) {
    console.log('parse chart...')
    return {
      type: Chart,
      args: [config.name || config.type, UIStore.parseExpr(config.type), Style.createSchema(config.style)]
    };
  }
}
