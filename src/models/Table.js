import {
  observable,
  computed
} from "mobx";
import {
  assignId
} from './util';

export class Column {
  store;
  key;

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

  @computed get state() {
    return this.store.state;
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

  constructor(store, inputItem, visibleExpr = true, disabledExpr = false, alignExpr,
    colSpanExpr, dataIndexExpr, fixedExpr, titleExpr, widthExpr, children = null) {
    this.key = assignId();
    this.store = store;

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

  static create(store, object = {}, options = {}) {
    return new Column(store, store.parse(object), object.visible || options.visible, object.disabled || options.visible, object.align,
      object.colSpan, object.dataIndex || object.value, object.fixed, object.title || object.text, object.width || object.columnWidth, (object.columns || []).map(it => Column.create(store, it)));
  }
}

export class Cell{

}

export class Table {
  store;
  key;

  @observable borderedExpr;
  @observable showHeaderExpr;
  @observable sizeExpr;
  @observable titleExpr;
  @observable dataSourceExpr;
  @observable allcolumns;
  @observable allrows = [];

  get type() {
    return 'table';
  }

  @computed get columns() {
    return this.allcolumns.filter(it => it.visible);
  }

  @computed get state() {
    return this.store.state;
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
      return rdata.map(cdata => Cell.create(this.store, {
        value: cdata
      }))
    })
  }

  constructor(store, columns = [], dataSourceExpr, borderedExpr = true,
    showHeaderExpr = true, sizeExpr = 'default', titleExpr = null) {
    this.key = assignId();
    this.store = store;

    this.borderedExpr = store.parseExpr(borderedExpr);
    this.showHeaderExpr = store.parseExpr(showHeaderExpr);
    this.sizeExpr = store.parseExpr(sizeExpr);
    this.titleExpr = store.parseExpr(titleExpr);
    this.dataSourceExpr = store.parseExpr(dataSourceExpr);
    this.allcolumns = columns;
  }

  static create(store, object = {}) {
    return new Table(store, (object.columns || []).map(it => Column.create(store, it, object)), object.dataSource || object.value, object.bordered,
      object.showHeader, object.size, object.title);
  }
}
