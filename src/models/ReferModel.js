import {
  computed,
  observable,
  runInAction,
  action,
} from 'mobx';
import Model from './Model';

// 参照
export default class ReferModel extends Model {

  // dropdownStyle: 'treetable',
  // @observable displayField;
  // @observable text; // 'Aggs.sum($objs,"a")',
  // @observable value; // '$objs',     // multiple: true,   是一个数组
  // setValue: 'objarr',
  // @observable multiple;
  // treeSelectable: 'leaf', // leaf parent all
  // columns: [{
  //   title: 'aaa',
  //   dataIndex: 'a'
  // }, {
  //   title: 'bbb',
  //   dataIndex: 'b'
  // }, {
  //   title: 'ccc',
  //   dataIndex: 'c'
  // }, {
  //   title: 'ddd',
  //   value: 'd'
  // }],
  // dataSource: '$refobjs',
  // onFocus
  // onTreeChange

  @computed get displayShowHeader() {
    const showHeader = Model.getProp(this.store, this.showHeader);
    const dropdownStyle = Model.getProp(this.store, this.dropdownStyle);
    if (showHeader === undefined) {
      if (dropdownStyle === 'table' || dropdownStyle === 'treetable') {
        return true;
      }
    }
    return false;
  }

  @computed get displayColumns() {
    let columns = Model.getProp(this.store, this.columns);
    if (!columns) {
      const dropdownStyle = Model.getProp(this.store, this.dropdownStyle);
      const displayField = Model.getProp(this.store, this.displayField);
      if (dropdownStyle === 'table' || dropdownStyle === 'treetable') {
        // 自动生成编码名称列
        columns = [{
          key: 'code',
          title: this.store.t('编码'),
          dataIndex: 'code',
          width: 100,
        }, {
          key: 'name',
          title: this.store.t('名称'),
          dataIndex: 'name',
          //width: 100
        }];
      }
      // 要是dropdownStyle=list只生成displayField列
      if (displayField) {
        // 要是没有列定义，有displayField自动生成一列
        columns = [{
          key: displayField,
          title: displayField,
          dataIndex: displayField
        }];
      }
    }
    return columns;
  }

  @computed get displayValue() {
    const value = Model.getProp(this.store, this.value);
    if (!value) {
      return null;
    }
    const text = Model.getProp(this.store, this.text);
    const displayField = Model.getProp(this.store, this.displayField);
    const multiple = Model.getProp(this.store, this.multiple);
    if (multiple) {
      return value.map(it => ({
        label: it[displayField] || text,
        value: it
      }));
    }
    // 要是有text没有displayField，就显示一个text
    if (text && !displayField) {
      return {
        label: text,
        value
      }
    } else {
      return {
        label: value[displayField] || text,
        value
      }
    }
  }

  constructor(store, {
    showSearch = true,
    allowClear = true,
    multiple = false,
    defaultExpandAll = false,
    text,
    value,
    displayField,
    columns,
    showHeader,
    ...props
  }) {
    super(store, {
      showSearch,
      allowClear,
      multiple,
      defaultExpandAll,
      text,
      value,
      displayField,
      columns,
      showHeader,
      ...props
    })
  }

}
