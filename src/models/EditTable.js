import {
  observable,
  computed
} from "mobx";
import {
  assignId
} from './util';
import UIStore from '../UIStore';
import UISchema from '../UISchema';

export class EditColumn {
  store;
  key;
  name;

  @observable children;

  // 单元格编辑器
  @observable inputItem;

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

  constructor(store, name, inputItem, visibleExpr, setVisibleExpr, disabledExpr, setDisabledExpr, alignExpr, setAlignExpr, colSpanExpr, setColSpanExpr, dataIndexExpr, setDataIndexExpr, fixedExpr, setFixedExpr, titleExpr, setTitleExpr, widthExpr, setWidthExpr, children) {
    this.key = assignId('EditColumn');
    this.store = store;
    this.name = name || this.key;

    this.inputItem = inputItem;
    this.alignExpr = alignExpr;
    this.setAlignExpr = setAlignExpr;
    this.colSpanExpr = colSpanExpr;
    this.setColSpanExpr = setColSpanExpr;
    this.dataIndexExpr = dataIndexExpr;
    this.setDataIndexExpr = setDataIndexExpr;
    this.fixedExpr = fixedExpr;
    this.setFixedExpr = setFixedExpr;
    this.titleExpr = titleExpr;
    this.setTitleExpr = setTitleExpr;
    this.widthExpr = widthExpr;
    this.setWidthExpr = setWidthExpr;
    this.disabledExpr = disabledExpr;
    this.setDisabledExpr = setDisabledExpr;
    this.visibleExpr = visibleExpr;
    this.setVisibleExpr = setVisibleExpr;
    this.children = children;
  }

  static createSchema(config = {}, options = {}) {
    console.log('parse edit table column...')
    return new UISchema(EditColumn,
      config.name || config.type,
      UIStore.createSchema(config),
      UIStore.parseExpr(config.visible || options.visible || true), UIStore.parseExpr(config.setVisible),
      UIStore.parseExpr(config.disable || options.disable || false), UIStore.parseExpr(config.setDisable),
      UIStore.parseExpr(config.align), UIStore.parseExpr(config.setAlign),
      UIStore.parseExpr(config.colSpan), UIStore.parseExpr(config.setColSpan),
      UIStore.parseExpr(config.dataIndex || config.value), UIStore.parseExpr(config.setDataIndex),
      UIStore.parseExpr(config.fixed), UIStore.parseExpr(config.setFixed),
      UIStore.parseExpr(config.title || config.text), UIStore.parseExpr(config.setTitle),
      UIStore.parseExpr(config.width || config.columnWidth), UIStore.parseExpr(config.setWidth),
      (config.columns || []).map(it => EditColumn.createSchema(it))
    )
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
  @observable setBorderedExpr;
  @observable showHeaderExpr;
  @observable setShowHeaderExpr;
  @observable sizeExpr;
  @observable setSizeExpr;
  @observable titleExpr;
  @observable setTitleExpr;
  @observable dataSourceExpr;
  @observable setDataSourceExpr;
  @observable allcolumns;
  @observable allrows = [];

  @observable visibleExpr;
  @observable setVisibleExpr;
  @observable disableExpr;
  @observable setDisableExpr;

  get type() {
    return 'edittable';
  }

  @computed get columns() {
    return this.allcolumns.filter(it => it.visible);
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
  @computed get bordered() {
    return this.store.execExpr(this.borderedExpr);
  }
  set bordered(value) {
    if (this.setBordered) {
      return this.store.setViewModel(this.setBordered, value);
    }
    this.borderedExpr = UIStore.parseExpr(value);
  }
  @computed get setBordered() {
    return this.store.execExpr(this.setBorderedExpr);
  }
  set setBordered(setValue) {
    this.setBorderedExpr = UIStore.parseExpr(setValue);
  }
  @computed get showHeader() {
    return this.store.execExpr(this.showHeaderExpr);
  }
  set showHeader(value) {
    if (this.setShowHeader) {
      return this.store.setViewModel(this.setShowHeader, value);
    }
    this.showHeaderExpr = UIStore.parseExpr(value);
  }
  @computed get setShowHeader() {
    return this.store.execExpr(this.setShowHeaderExpr);
  }
  set setShowHeader(setValue) {
    this.setShowHeaderExpr = UIStore.parseExpr(setValue);
  }
  @computed get size() {
    return this.store.execExpr(this.sizeExpr);
  }
  set size(value) {
    if (this.setSize) {
      return this.store.setViewModel(this.setSize, value);
    }
    this.sizeExpr = UIStore.parseExpr(value);
  }
  @computed get setSize() {
    return this.store.execExpr(this.setSizeExpr);
  }
  set setSize(setValue) {
    this.setSizeExpr = UIStore.parseExpr(setValue);
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

  @computed get dataSource() {
    return this.store.execExpr(this.dataSourceExpr);
  }
  set dataSource(value) {
    if (this.setDataSource) {
      return this.store.setViewModel(this.setDataSource, value);
    }
    this.dataSourceExpr = UIStore.parseExpr(value);
  }
  @computed get setDataSource() {
    return this.store.execExpr(this.setDataSourceExpr);
  }
  set setDataSource(setValue) {
    this.setDataSourceExpr = UIStore.parseExpr(setValue);
  }
  @computed get rows() {
    return (this.store.model.get(this.dataSource) || []).map(rdata => {
      if (!Array.isArray(rdata)) {
        rdata = [rdata];
      }
      // TODO 不用每次创建cell，状态要保持
      return rdata.map(cdata => EditCell.createSchema({
        value: cdata
      }))
    })
  }

  constructor(store, name, columns, dataSourceExpr, setDataSourceExpr, borderedExpr, setBorderedExpr, visibleExpr, setVisibleExpr, disableExpr, setDisableExpr, showHeaderExpr, setShowHeaderExpr, sizeExpr, setSizeExpr, titleExpr, setTitleExpr) {
    this.key = assignId('EditTable');
    this.store = store;
    this.name = name || this.key;

    this.borderedExpr = borderedExpr;
    this.setBorderedExpr = setBorderedExpr;
    this.showHeaderExpr = showHeaderExpr;
    this.setShowHeaderExpr = setShowHeaderExpr;
    this.visibleExpr = visibleExpr;
    this.setVisibleExpr = setVisibleExpr;
    this.disableExpr = disableExpr;
    this.setDisableExpr = setDisableExpr;
    this.sizeExpr = sizeExpr;
    this.setSizeExpr = setSizeExpr;
    this.titleExpr = titleExpr;
    this.setTitleExpr = setTitleExpr;
    this.dataSourceExpr = dataSourceExpr;
    this.setDataSourceExpr = setDataSourceExpr;
    this.allcolumns = columns;
  }

  static createSchema(config = {}) {
    console.log('parse edit table...')
    return new UISchema(EditTable,
      config.name || config.type,
      (config.columns || []).map(it => EditColumn.createSchema(it, config)),
      UIStore.parseExpr(config.dataSource || config.value), UIStore.parseExpr(config.setDataSource),
      UIStore.parseExpr(config.bordered || true), UIStore.parseExpr(config.setBordered),
      UIStore.parseExpr(config.visible || true), UIStore.parseExpr(config.setVisible),
      UIStore.parseExpr(config.disable || false), UIStore.parseExpr(config.setDisable),
      UIStore.parseExpr(config.showHeader || true), UIStore.parseExpr(config.setShowHeader),
      UIStore.parseExpr(config.size || 'default'), UIStore.parseExpr(config.setSize),
      UIStore.parseExpr(config.title), UIStore.parseExpr(config.setTitle)
    )
  }
}
