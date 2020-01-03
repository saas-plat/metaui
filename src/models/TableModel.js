import {
  computed,
  observable,
  runInAction,
  action,
} from 'mobx';
import Model from './Model';

// 三维表模型
export default class TableModel extends Model {

  constructor(store, {
    checkDisableds = {},
    emptyRows = 10,
    columns = [],
    dataSource = [],
    ...props
  }) {
    super(store, {
      checkDisableds,
      emptyRows,
      columns,
      dataSource,
      ...props
    });
  }

  @computed get data() {
    const emptyRows = [];
    if (this.emptyRows) {
      for (let i = 0; i < this.emptyRows; i++) {
        emptyRows.push({
          key: 'empty_'+i,
        })
      }
    }
    return this.dataSource.concat(emptyRows);
  }

  isRowCheckable(index) {
    return !this.isEmptyRow(index) && this.checkDisableds[index] !== false;
  }

  isEmptyRow(index) {
    return index > this.dataSource.length;
  }

  @action setRow(index, key) {
    return (value) => {
      const dataSource = [...this.state.dataSource];
      dataSource[index][key] = value;
      this.dataSource = dataSource;
    };
  }

  @action deleteRow(index) {
    const dataSource = [...this.dataSource];
    dataSource.splice(index, 1);
    this.dataSource = dataSource;
  }

  @action addRow() {
    const {
      count,
      dataSource
    } = this;
    const newData = {
      key: count,
      name: `Edward King ${count}`,
      age: 32,
      address: `London, Park Lane no. ${count}`
    };
    this.dataSource = [
      ...dataSource,
      newData
    ];
  }

  @action addColumns(...column) {
    this.columns.push(...column);
  }

  @action selectColumn(index) {
    this.columnIndex = index;
  }

  @action enterRow(index) {
    this.rowIndex = index;
  }

  isCellEditable(rowIndex, columnIndex) {
    return this.editable && this.editable.rowIndex === rowIndex && this.editable.columnIndex === columnIndex;
  }

  @action startEdit(rowIndex, columnIndex) {
    this.editable = {
      rowIndex,
      columnIndex
    }
  }
  @action endEdit() {
    this.editable = null;
  }
  @action setCell(rowIndex, columnIndex, value) {
    const row = this.dataSource[rowIndex];
    const col = this.getColumn(columnIndex);
    if (row && col) {
      row[col.dataIndex] = value;
    }
  }

  getColumn(index, columns = this.columns, counter = {
    i: 0
  }) {
    for (const column of columns) {
      if (counter.i === index) {
        return column;
      }
      counter.i += 1;
      if (column.children) {
        const ret = this.getColumn(index, column.children, counter);
        if (ret) {
          return ret;
        }
      }
    }
  }

  // 校验函数 合法性、必输项
  validate() {

  }

  clear() {
    this.dataSource = [];
  }

  @action selectRows(...keys) {
    this.selectedKeys = keys;
  }

  // 设置grid取消选中的行
  unselect(rowKeys) {
    this.selectedKeys = this.selectedKeys.filter(key => rowKeys.indexOf(key) === -1);
  }

  // 选中所有行
  selectAll() {
    this.selectedKeys = this.dataSource.map(it => it.key).filter(key => key);
  }

  // 取消选中所有行
  unselectAll() {
    this.selectedKeys = [];
  }
}
