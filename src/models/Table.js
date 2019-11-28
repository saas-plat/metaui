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

export class Column {
  store;
  key;
  name;

  // 子列
  @observable allcolumns;

  @observable visibleExpr;
  @observable setVisibleExpr;
  @observable disabledExpr;
  @observable setDisabledExpr;

  @observable alignExpr;
  @observable setAlignExpr;
  @observable colSpanExpr;
  @observable setColSpanExpr;
  @observable dataIndexExpr;
  @observable setDataIndexExpr;
  @observable fixedExpr;
  @observable setFixedExpr;
  @observable titleExpr;
  @observable setTitleExpr;
  @observable widthExpr;
  @observable setWidthExpr;

  get type() {
    return 'column';
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
  @computed get disabled() {
    return this.store.execExpr(this.disabledExpr);
  }
  set disabled(value) {
    if (this.setDisabled) {
      return this.store.setViewModel(this.setDisabled, value);
    }
    this.disabledExpr = UIStore.parseExpr(value);
  }
  @computed get setDisabled() {
    return this.store.execExpr(this.setDisabledExpr);
  }
  set setDisabled(setValue) {
      this.setDisabledExpr = UIStore.parseExpr(setValue);
  }

  @computed get align() {
    return this.store.execExpr(this.alignExpr);
  }
  set align(value) {
    if (this.setAlign) {
      return this.store.setViewModel(this.setAlign, value);
    }
    this.alignExpr = UIStore.parseExpr(value);
  }
  @computed get setAlign() {
    return this.store.execExpr(this.setAlignExpr);
  }
  set setAlign(setValue) {
      this.setAlignExpr = UIStore.parseExpr(setValue);
  }
  @computed get colSpan() {
    return this.store.execExpr(this.colSpanExpr);
  }
  set colSpan(value) {
    if (this.setColSpan) {
      return this.store.setViewModel(this.setColSpan, value);
    }
    this.colSpanExpr = UIStore.parseExpr(value);
  }
  @computed get setColSpan() {
    return this.store.execExpr(this.setColSpanExpr);
  }
  set setColSpan(setValue) {
      this.setColSpanExpr = UIStore.parseExpr(setValue);
  }
  @computed get dataIndex() {
    return this.store.execExpr(this.dataIndexExpr);
  }
  set dataIndex(value) {
    if (this.setDataIndex) {
      return this.store.setViewModel(this.setDataIndex, value);
    }
    this.dataIndexExpr = UIStore.parseExpr(value);
  }
  @computed get setDataIndex() {
    return this.store.execExpr(this.setDataIndexExpr);
  }
  set setDataIndex(setValue) {
      this.setDataIndexExpr = UIStore.parseExpr(setValue);
  }
  @computed get fixed() {
    return this.store.execExpr(this.fixedExpr);
  }
  set fixed(value) {
    if (this.setFixed) {
      return this.store.setViewModel(this.setFixed, value);
    }
    this.fixedExpr = UIStore.parseExpr(value);
  }
  @computed get setFixed() {
    return this.store.execExpr(this.setFixedExpr);
  }
  set setFixed(setValue) {
      this.setFixedExpr = UIStore.parseExpr(setValue);
  }
  @computed get title() {
    return this.store.execExpr(this.titleExpr);
  }
  set title(value) {
    if (this.setTitle) {
      return this.store.setViewModel(this.setTitle, value);
    }
    this.titleExpr = UIStore.parseExpr(value);
  }
  @computed get setTitle() {
    return this.store.execExpr(this.setTitleExpr);
  }
  set setTitle(setValue) {
      this.setTitleExpr = UIStore.parseExpr(setValue);
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

  constructor(store, name, visibleExpr  , disabledExpr  , alignExpr,
    colSpanExpr, dataIndexExpr, fixedExpr, titleExpr, widthExpr, columns  ) {
    this.key = assignId('Column');
    this.store = store;
    this.name = name || this.key;

    this.alignExpr = alignExpr;
    this.colSpanExpr = colSpanExpr;
    this.dataIndexExpr = dataIndexExpr;
    this.fixedExpr = fixedExpr;
    this.titleExpr = titleExpr;
    this.widthExpr = widthExpr;
    this.disabledExpr = disabledExpr;
    this.visibleExpr = visibleExpr;
    this.allcolumns = columns;
  }

  static createSchema(config = {}, options = {}) {
    console.log('parse table column...')
    return {
      type: Column,
      args: [UIStore.parseExpr(config.name || config.type),
        UIStore.parseExpr(config.visible || options.visible || true),
         UIStore.parseExpr(config.disabled || options.disabled || false),
        UIStore.parseExpr(config.align),
        UIStore.parseExpr(config.colSpan), UIStore.parseExpr(config.dataIndex || config.value),
         UIStore.parseExpr(config.fixed), UIStore.parseExpr(config.title || config.text),
        UIStore.parseExpr(config.width || config.columnWidth), (config.columns || []).map(it => Column.createSchema(it))
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

  @observable typeExpr;
  @observable setTypeExpr; // table tree

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

  constructor(store, name, typeExpr, onLoading, onLoad, onLoaded) {
    //assert(store);

    this.key = assignId('Table');
    this.store = store;
    this.name = name || this.key;
    this.typeExpr = typeExpr;

    this.onLoading = onLoading;
    this.onLoad = onLoad;
    this.onLoaded = onLoaded;
  }

  static createSchema(config = []) {
    let name, onLoading, onLoad, onLoaded;
    console.log('parse table...')
    name = config.name   || config.type;
    onLoading = config.onLoading;
    onLoad = config.onLoad;
    onLoaded = config.onLoaded;

    return {
      type: Table,
      args: [name, UIStore.parseExpr(config.type || 'table'),
        (config.columns || []).map(it => Column.createSchema(it, config)),
        Action.createSchema(onLoading), Action.createSchema(onLoad), Action.createSchema(onLoaded)
      ]
    };
  }
}
