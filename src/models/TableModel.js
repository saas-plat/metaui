import {
  computed,
  action,
} from 'mobx';
import _keys from 'lodash/keys';
import _mapValues from 'lodash/mapValues';
import Model from './Model';
import {
  createValidator,
  t
} from '../utils';
//const CODE_LENGTH = 7;

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
    // 同步数据和状态对象，要不mobx直接插入会报错
    this.rowState = new Array(this.dataSource.length);
    this.cellState = new Array(this.dataSource.length);
  }

  @computed get data() {
    const emptyRows = [];
    if (this.emptyRows) {
      for (let i = 0; i < this.emptyRows; i++) {
        emptyRows.push({})
      }
    }
    return this.dataSource.concat(emptyRows).map((obj, rowIndex) => {
      // 状态都可能是未初始化
      const cellState = (this.cellState.length > rowIndex ? this.cellState[rowIndex] : null) || [];
      const value = _mapValues(obj, (value, key) => ({
        ...cellState[this.getColumnIndexByDataIndex(key)],
        value,
      }));
      const key = (rowIndex + 1).toString(); //(Array(CODE_LENGTH).join('0') + rowIndex).slice(-CODE_LENGTH);
      const {
        error,
        ...rowState
      } = (this.rowState.length > rowIndex ? this.rowState[rowIndex] : null) || {};
      return {
        ...rowState,
        // 把单元格错误合并到行上显示
        error: error || cellState.filter(cell => cell).map(cell => cell.error).join(','),
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
    if (value !== undefined) {
      this.dataSource[rowIndex] = value;
    }
    // 行更新需要清空列状态
    //this.cellState.splice(rowIndex, 1, new Array(this.columns.length));
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
    this.cellState.push([]);
    this.rowState.push({});
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

  @action async startEdit(rowIndex = 0, columnIndex = 0) {
    if (this.editable && (this.editable.rowIndex !== rowIndex || this.editable.columnIndex !== columnIndex)) {
      await this.endEdit();
    }
    this.editable = {
      rowIndex,
      columnIndex
    }
  }

  @action async endEdit() {
    await this.validate(this.editable.rowIndex, this.editable.columnIndex);
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
      if (value !== undefined) {
        row[col.dataIndex] = value;
      }
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

  @computed get createValidator() {
    return createValidator(...this.columns);
  }

  // 校验函数 合法性、必输项
  @action async validate(rowIndex, columnIndex) {
    if (rowIndex === 0 || rowIndex > 0) {
      if (columnIndex === 0 || columnIndex > 0) {
        const row = this.dataSource[rowIndex];
        const column = this.columns[columnIndex];
        try {
          await this.createValidator.validate(row, {
            first: true,
            firstFields: [column.dataIndex]
          });
          this.clearError(rowIndex, columnIndex);
          return true;
        } catch (e) {
          this.setCell(rowIndex, columnIndex, {
            error: e.errors[0].message || t('{{title}}数据无效', column)
          });
          return false;
        }
      } else {
        const row = this.dataSource[rowIndex];
        try {
          await this.createValidator.validate(row);
          this.clearError(rowIndex);
          return true;
        } catch (e) {
          for (const error of e.errors) {
            const columnIndex = this.getColumnIndexByDataIndex(error.field);
            const column = this.columns[columnIndex];
            this.setCell(rowIndex, columnIndex, {
              error: error.message || t('{{title}}数据无效', column)
            });
          }
          return false;
        }
      }
    } else {
      for (let rowIndex = 0, l = this.dataSource.length; rowIndex < l; rowIndex++) {
        if (!await this.validate(rowIndex)) {
          return false;
        }
      }
      return true;
    }
  }

  clear() {
    // 不能直接赋值[]，有可能是表达式
    this.dataSource.clear();
    this.rowState.clear();
    this.cellState.clear();
    this.checkDisableds = {};
  }

  @action selectRows(...keys) {
    this.selectedKeys = keys;
  }

  // 设置grid取消选中的行
  @action unselect(rowKeys) {
    this.selectedKeys = this.selectedKeys.filter(key => rowKeys.indexOf(key) === -1);
  }

  // 选中所有行
  @action selectAll() {
    this.selectedKeys = this.dataSource.map(it => it.key).filter(key => key);
  }

  // 取消选中所有行
  @action unselectAll() {
    this.selectedKeys = [];
  }

  @action setError(rowIndex, error) {
    this.setRow(rowIndex, {
      error
    });
  }

  @action clearError(rowIndex, columnIndex) {
    if (rowIndex === 0 || rowIndex > 0) {
      if (columnIndex === 0 || columnIndex > 0) {
        const cellState = this.cellState.length > rowIndex ? this.cellState[rowIndex] : [];
        const cell = cellState.length > columnIndex ? cellState[columnIndex] : null;
        if (cell) {
          cell.error = null;
        }
      } else {
        this.setRow(rowIndex, {
          error: null
        });
        const cellState = this.cellState.length > rowIndex ? this.cellState[rowIndex] : null;
        if (cellState) {
          for (const cell of cellState) {
            cell.error = null;
          }
        }
      }
    } else {
      this.dataSource.forEach((v, rowIndex) => {
        this.clearError(rowIndex);
      })
    }
  }
}
