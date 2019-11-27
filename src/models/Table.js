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

export class Column {
  store;
  key;
  name;

  // 子列
  @observable allcolumns;

  @observable visibleExpr;
  @observable disabledExpr;

  @observable alignExpr;
  @observable colSpanExpr;
  @observable dataIndexExpr;
  @observable fixedExpr;
  @observable titleExpr;
  @observable widthExpr;

  get type() {
    return 'column';
  }

  @computed get visible() {
    return this.store.execExpr(this.visibleExpr);
  }
  set visible(visibleExpr) {
    this.visibleExpr = this.store.parseExpr(visibleExpr);
  }
  @computed get disabled() {
    return this.store.execExpr(this.disabledExpr);
  }
  set disabled(disabledExpr) {
    this.disabledExpr = this.store.parseExpr(disabledExpr);
  }

  @computed get align() {
    return this.store.execExpr(this.alignExpr);
  }
  set align(alignExpr) {
    this.alignExpr = this.store.parseExpr(alignExpr);
  }
  @computed get colSpan() {
    return this.store.execExpr(this.colSpanExpr);
  }
  set colSpan(colSpanExpr) {
    this.colSpanExpr = this.store.parseExpr(colSpanExpr);
  }
  @computed get dataIndex() {
    return this.store.execExpr(this.dataIndexExpr);
  }
  set dataIndex(dataIndexExpr) {
    this.dataIndexExpr = this.store.parseExpr(dataIndexExpr);
  }
  @computed get fixed() {
    return this.store.execExpr(this.fixedExpr);
  }
  set fixed(fixedExpr) {
    this.fixedExpr = this.store.parseExpr(fixedExpr);
  }
  @computed get title() {
    return this.store.execExpr(this.titleExpr);
  }
  set title(titleExpr) {
    this.titleExpr = this.store.parseExpr(titleExpr);
  }
  @computed get width() {
    return this.store.execExpr(this.widthExpr);
  }
  set width(widthExpr) {
    this.widthExpr = this.store.parseExpr(widthExpr);
  }

  constructor(store, name, visibleExpr = true, disabledExpr = false, alignExpr,
    colSpanExpr, dataIndexExpr, fixedExpr, titleExpr, widthExpr, columns = null) {
    this.key = assignId('Column');
    this.store = store;
    this.name = name || this.key;

    this.alignExpr = store.parseExpr(alignExpr);
    this.colSpanExpr = store.parseExpr(colSpanExpr);
    this.dataIndexExpr = store.parseExpr(dataIndexExpr);
    this.fixedExpr = store.parseExpr(fixedExpr);
    this.titleExpr = store.parseExpr(titleExpr);
    this.widthExpr = store.parseExpr(widthExpr);
    this.disabledExpr = store.parseExpr(disabledExpr);
    this.visibleExpr = store.parseExpr(visibleExpr);
    this.allcolumns = columns;
  }

  static createSchema(object = {}, options = {}) {
    console.log('create table column...')
    return {
      type: Column,
      args: [object.name,
        object.visible || options.visible, object.disabled || options.visible, object.align,
        object.colSpan, object.dataIndex || object.value, object.fixed, object.title || object.text,
        object.width || object.columnWidth, (object.columns || []).map(it => Column.createSchema(it))
      ]
    };
  }
}

export class Cell {
  store;
  key;
  name;

  constructor(store, name) {
    this.key = assignId('Cell');
    this.store = store;
    this.name = name || this.key;
  }
}

// 数据表格模型
export class Table {
  store;
  key;

  @observable onLoading;
  @observable onLoad;
  @observable onLoaded;

  @observable typeExpr; // table tree

  @computed get type() {
    return this.store.execExpr(this.typeExpr);
  }
  set type(typeExpr) {
    this.typeExpr = this.store.parseExpr(typeExpr);
  }

  constructor(store, name, type, onLoading, onLoad, onLoaded) {
    //assert(store);

    this.key = assignId('Table');
    this.store = store;
    this.name = name || this.key;
    this.typeExpr = this.store.parseExpr(type);

    this.onLoading = onLoading;
    this.onLoad = onLoad;
    this.onLoaded = onLoaded;
  }

  static createSchema(object = []) {
    let name, onLoading, onLoad, onLoaded;
    console.log('create table...')
    name = object.name;
    onLoading = object.onLoading;
    onLoad = object.onLoad;
    onLoaded = object.onLoaded;

    return {
      type: Table,
      args: [name, object.type || 'table',
        (object.columns || []).map(it => Column.createSchema(it, object)),
        Action.createSchema(onLoading), Action.createSchema(onLoad), Action.createSchema(onLoaded)
      ]
    };
  }
}
