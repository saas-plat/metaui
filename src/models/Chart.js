import {
  observable,
  computed
} from "mobx";
import {
  assignId
} from './util';

class Style {
  store;
  key;

  @observable name;
  @observable heightExpr;
  @observable widthExpr;

  @computed get height() {
    return this.store.execExpr(this.heightExpr);
  }

  set height(heightExpr) {
    this.heightExpr = this.store.parseExpr(heightExpr);
  }

  @computed get width() {
    return this.store.execExpr(this.widthExpr);
  }

  set width(widthExpr) {
    this.widthExpr = this.store.parseExpr(widthExpr);
  }

  constructor(store, name, heightExpr = '300', widthExpr = '100%') {


    this.key = assignId();
    this.store = store;
    this.name = name || 'Style' + this.key;

    this.heightExpr = this.store.parseExpr(heightExpr);
    this.widthExpr = this.store.parseExpr(widthExpr);
  }

  static create(store, object = {}) {
    return new Style(store, object.name, object.height, object.width);
  }
}

export class Chart {
  store;
  key;

  @observable name;
  @observable typeExpr;
  @observable style;

  get type(){
    return 'chart';
  }

  @computed get state() {
    return this.store.state;
  }

  @computed get type() {
    return this.store.execExpr(this.typeExpr);
  }

  set type(typeExpr) {
    this.typeExpr = this.store.parseExpr(typeExpr);
  }

  constructor(store, name, typeExpr, style) {
    assert(store);

    this.key = assignId();
    this.store = store;
    this.name = name || 'Chart' + this.key;

    this.typeExpr = store.parseExpr(typeExpr);
    this.style = style;
  }

  static create(store, object) {
    return new Chart(store, object.name, object.type, Style.create(store, object.style));
  }
}
