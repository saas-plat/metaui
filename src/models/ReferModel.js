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
    multiple = false,
    text,
    value,
    displayField,
    ...props
  }) {
    super(store, {
      multiple,
      text,
      value,
      displayField,
      ...props
    })
  }

}
