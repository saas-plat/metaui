import {
  computed,
  action,
} from 'mobx';
import _keys from 'lodash/keys';
import _mapValues from 'lodash/mapValues';
import Model from './Model';

const CODE_LENGTH = 7;

// 三维表模型
export default class TableModel extends Model {

  constructor(store, {
    checkDisableds = {},
    emptyRows = 1,
    columns = [],
    dataSource = [],
    ...props
  }) {
    super(store, {
      checkDisableds,
      emptyRows,
      columns,
      dataSource,
      rowState: [], // 行状态
      cellState: [], // 单元格状态
      ...props
    });
  }

  @computed get data() {
    const emptyRows = [];
    if (this.emptyRows) {
      for (let i = 0; i < this.emptyRows; i++) {
        emptyRows.push({})
      }
    }
    return this.dataSource.concat(emptyRows).map((obj, rowIndex) => {
      const cellState = this.cellState.length > rowIndex ? this.cellState[rowIndex] : [];
      const value = _mapValues(obj, (value, key) => ({
        ...cellState[this.getColumnIndexByDataIndex(key)],
        value,
      }));
      const key = (Array(CODE_LENGTH).join('0') + rowIndex).slice(-CODE_LENGTH);
      const rowState = this.rowState.length > rowIndex ? this.rowState[rowIndex] : null;
      return {
        ...rowState,
        key,
        value
      };
    });
  }

  isRowCheckable(index) {
    return !this.isEmptyRow(index) && this.checkDisableds[index] !== false;
  }

  isEmptyRow(index) {
    return index >= this.dataSource.length;
  }

  @action setRow(rowIndex, {
    value,
    ...state
  }) {
    this.dataSource[rowIndex] = value;
    this.cellState.splice(rowIndex, 1);
    const row = this.cellState.length > rowIndex ? this.rowState[rowIndex] : null;
    if (!row) {
      this.rowState[rowIndex] = state;
    } else {
      _keys(state).forEach(key => {
        row[key] = state[key];
      })
    }
  }

  @action deleteRow(index) {
    if (index > this.dataSource.length) {
      return false;
    }
    this.cellState.splice(index, 1);
    this.rowState.splice(index, 1);
    this.dataSource.splice(index, 1);
    return true;
  }

  @action addRow(newData = {}) {
    this.dataSource.push(newData);
  }

  @action insertRow(index, newData = {}) {
    this.dataSource.splice(index, 0, newData);
    this.cellState.splice(index, 0, []);
    this.rowState.splice(index, 0, {});
  }

  @action moveRow(fromIndex, toIndex) {
    if (fromIndex > this.dataSource.length || toIndex === undefined || toIndex === null) {
      return false;
    }
    const data = this.dataSource.splice(fromIndex, 1);
    const cell = this.cellState.splice(fromIndex, 1);
    const row = this.rowState.splice(fromIndex, 1);
    this.dataSource.splice(toIndex, 0, data);
    this.cellState.splice(toIndex, 0, cell);
    this.rowState.splice(toIndex, 0, row);
    return true;
  }

  @action addColumns(...column) {
    this.columns.push(...column);
  }

  @action selectColumn(index) {
    this.columnIndex = index;
  }

  @action enterRow(index) {
    for (let i = this.dataSource.length; i < index + 1; i++) {
      // 自动添加行
      this.addRow();
    }
    this.rowIndex = index;
  }

  isCellEditable(rowIndex, columnIndex) {
    return this.editable && this.editable.rowIndex === rowIndex && this.editable.columnIndex === columnIndex;
  }

  @action startEdit(rowIndex = 0, columnIndex = 0) {
    if (this.editable && (this.editable.rowIndex !== rowIndex || this.editable.columnIndex !== columnIndex)){
      this.endEdit();
    }
    this.editable = {
      rowIndex,
      columnIndex
    }
  }

  @action endEdit() {
    this.editable = null;
  }

  @action setCell(rowIndex, columnIndex, {
    value,
    ...state
  }) {
    const row = this.dataSource[rowIndex];
    const cellState = this.cellState.length > rowIndex ? this.cellState[rowIndex] : null;
    const col = this.getColumn(columnIndex);
    if (row && col) {
      row[col.dataIndex] = value;
      if (!cellState) {
        const cellState = [];
        cellState[columnIndex] = state;
        this.cellState[rowIndex] = cellState;
      } else {
        const cell = cellState.length > 0 ? cellState[columnIndex] : null;
        if (!cell) {
          cell[columnIndex] = state;
        } else {
          _keys(state).forEach(key => {
            cell[key] = state[key];
          })
        }
      }
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

  getColumnIndexByDataIndex(dataIndex, columns = this.columns, counter = {
    i: 0
  }) {
    for (const column of columns) {
      if (column.dataIndex === dataIndex) {
        return counter.i;
      }
      counter.i += 1;
      if (column.children) {
        const ret = this.getColumnIndexByDataIndex(dataIndex, column.children, counter);
        if (ret) {
          return ret;
        }
      }
    }
  }

  @action setColumn(index, state) {
    const col = this.getColumn(index);
    if (!col) {
      return;
    }
    _keys(state).forEach(key => {
      col[key] = state[key];
    })
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
