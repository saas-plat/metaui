import {
  observable,
  computed
} from "mobx";
import {
  assignId
} from './util';
import UIStore from '../UIStore';

export class EditColumn {
  store;
  key;
  name;

  @observable children;

  // 单元格编辑器
  @observable inputItem;

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

  constructor(store, name, inputItem, visibleExpr = true, disabledExpr = false, alignExpr,
    colSpanExpr, dataIndexExpr, fixedExpr, titleExpr, widthExpr, children = null) {
    this.key = assignId('EditColumn');
    this.store = store;
    this.name = name || this.key;

    this.inputItem = inputItem;
    this.alignExpr = store.parseExpr(alignExpr);
    this.colSpanExpr = store.parseExpr(colSpanExpr);
    this.dataIndexExpr = store.parseExpr(dataIndexExpr);
    this.fixedExpr = store.parseExpr(fixedExpr);
    this.titleExpr = store.parseExpr(titleExpr);
    this.widthExpr = store.parseExpr(widthExpr);
    this.disabledExpr = store.parseExpr(disabledExpr);
    this.visibleExpr = store.parseExpr(visibleExpr);
    this.children = children;
  }

  static createSchema(object = {}, options = {}) {
    console.log('create edit table column...')
    return {
      type: Column,
      args: [object.name, UIStore.createSchema(object),
        object.visible || options.visible, object.disabled || options.visible, object.align,
        object.colSpan, object.dataIndex || object.value, object.fixed, object.title || object.text,
        object.width || object.columnWidth, (object.columns || []).map(it => Column.createSchema(it))
      ]
    };
  }
}

export class EditCell {
  store;
  key;
  name;

  constructor(store, name) {
    this.key = assignId('EditCell');
    this.store = store;
    this.name = name || this.key;
  }
}

// 编辑表格模型
export class EditTable {
  store;
  key;
  name;

  @observable borderedExpr;
  @observable showHeaderExpr;
  @observable sizeExpr;
  @observable titleExpr;
  @observable dataSourceExpr;
  @observable allcolumns;
  @observable allrows = [];

  get type() {
    return 'edittable';
  }

  @computed get columns() {
    return this.allcolumns.filter(it => it.visible);
  }

  @computed get visible() {
    return this.columns.length > 0;
  }
  @computed get bordered() {
    return this.store.execExpr(this.borderedExpr);
  }
  set bordered(borderedExpr) {
    this.borderedExpr = this.store.parseExpr(borderedExpr);
  }
  @computed get showHeader() {
    return this.store.execExpr(this.showHeaderExpr);
  }
  set showHeader(showHeaderExpr) {
    this.showHeaderExpr = this.store.parseExpr(showHeaderExpr);
  }
  @computed get size() {
    return this.store.execExpr(this.sizeExpr);
  }
  set size(sizeExpr) {
    this.sizeExpr = this.store.parseExpr(sizeExpr);
  }
  @computed get title() {
    return this.store.execExpr(this.titleExpr);
  }
  set title(titleExpr) {
    this.titleExpr = this.store.parseExpr(titleExpr);
  }

  @computed get dataSource() {
    return this.store.execExpr(this.dataSourceExpr);
  }
  set dataSource(dataSourceExpr) {
    this.dataSourceExpr = this.store.parseExpr(dataSourceExpr);
  }
  @computed get rows() {
    return (this.store.model.get(this.dataSource) || []).map(rdata => {
      if (!Array.isArray(rdata)) {
        rdata = [rdata];
      }
      // TODO 不用每次创建cell，状态要保持
      return rdata.map(cdata => Cell.createSchema({
        value: cdata
      }))
    })
  }

  constructor(store, name, columns = [], dataSourceExpr, borderedExpr = true,
    showHeaderExpr = true, sizeExpr = 'default', titleExpr = null) {
    this.key = assignId('EditTable');
    this.store = store;
    this.name = name || this.key;

    this.borderedExpr = store.parseExpr(borderedExpr);
    this.showHeaderExpr = store.parseExpr(showHeaderExpr);
    this.sizeExpr = store.parseExpr(sizeExpr);
    this.titleExpr = store.parseExpr(titleExpr);
    this.dataSourceExpr = store.parseExpr(dataSourceExpr);
    this.allcolumns = columns;
  }

  static createSchema(object = {}) {
    console.log('create edit table...')
    return {
      type: EditTable,
      args: [object.name, (object.columns || []).map(it => Column.createSchema(it, object)),
        object.dataSource || object.value, object.bordered, object.showHeader, object.size, object.title
      ]
    };
  }
}
