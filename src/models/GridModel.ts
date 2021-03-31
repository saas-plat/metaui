import { DataModel, DeadLockError, SetOptions } from './BaseModel';
import { ContainerModel } from './ContainerModel';
import { createModel } from './util';
import _merge from 'lodash/merge';
import { observable, computed, action, runInAction } from 'mobx';

export class RowNode extends ContainerModel {}

export enum RowState {
  New,
  Edit,
  Delete,
}

export class RowData {
  // 行数据集不做观察
  private _data: any;
  @observable private _state: RowState;
  @observable private _checked = false;

  get data() {
    return this._data;
  }

  get state(): RowState {
    return this._state;
  }

  get checked(): boolean {
    return this._checked;
  }

  set data(data) {
    runInAction(() => {
      if (this._state === RowState.Delete) {
        throw new Error('row deleted!');
      }
      this._data = data;
      this._state = RowState.Edit;
    });
  }

  constructor(data) {
    this._data = data;
    this._state = RowState.New;
  }

  @action replace(data) {
    if (this._state === RowState.Delete) {
      throw new Error('row deleted!');
    }
    this._data = data;
    this._state = RowState.Edit;
  }

  @action update(data) {
    if (this._state === RowState.Delete) {
      throw new Error('row deleted!');
    }
    _merge(this._data, data);
    this._state = RowState.Edit;
  }

  @action clear() {
    if (this._state === RowState.Delete) {
      throw new Error('row deleted!');
    }
    this._data = {};
    this._state = RowState.Edit;
  }

  @action delete() {
    this._state = RowState.Delete;
  }

  @action check(checkOrNot = true) {
    this._checked = checkOrNot;
  }
}

export class GridModel extends DataModel {
  // 所有数据
  get dataSource(): RowData[] {
    return this.get('dataSource');
  }

  @computed get size(): number {
    return this.dataSource.filter((it) => it.state !== RowState.Delete).length;
  }

  // 当前显示的行
  @computed get rows(): any[] {
    const indexs = this.get('rows');
    return this.dataSource.filter((it, i) => indexs.indexOf(i) > -1).map((row) => row.data);
  }

  @computed get selectRows(): any[] {
    return this.dataSource.filter((it) => it.checked).map((row) => row.data);
  }

  @computed get data(): any[] {
    return this.dataSource.filter((it) => it.state !== RowState.Delete).map((it) => it.data);
  }

  get columns() {
    return this.get('columns');
  }

  constructor(data) {
    data = {
      columns: [],
      dataSource: [],
      ...data,
    };
    data.dataSource = data.dataSource.map((row) => new RowData(row));
    super(data);
    for (const item of data.columns) {
      this.initColumn(item);
    }
    this.initRowStates();
  }

  private initColumn(column) {}

  private initRowStates() {}

  async setData(value, options?: SetOptions) {
    const data = (value && value.map((row) => (row instanceof RowData ? row : new RowData(row)))) || [];
    await this.set('dataSource', data, options);
    // 支持相同boField的数据字段自动同步更新机制
    if (this.parent) {
      await this.parent.sync(this, data);
    }
  }

  async addRow(data = {}, index?: number) {
    await this.setRow(index || -1, data);
  }

  async delRow(index: number) {
    if (this.dataSource.length > index && index > -1) {
      const row = this.dataSource[index];
      row.delete();
      // 暂时就是直接删除，要不状态维护起来复杂
      this.dataSource.splice(index, 1);
      const value = row.data;
      try {
        await this.fire('rowChanged', { oldValue: value, value, index, state: row.state, checked: row.checked });
      } catch (err) {
        // 事件循环终止
        if (!(err instanceof DeadLockError)) {
          throw err;
        }
      }
      // 支持相同boField的数据字段自动同步更新机制
      if (this.parent) {
        await this.parent.sync(this, this.data);
      }
    }
  }

  async delRowByField(colName, value) {
    const row = this.dataSource.find((it) => it.data[colName] === value);
    if (row) {
      const index = this.dataSource.indexOf(row);
      row.delete();
      this.dataSource.splice(index, 1);
      const value = row.data;
      try {
        await this.fire('rowChanged', { oldValue: value, value, index, state: row.state, checked: row.checked });
      } catch (err) {
        // 事件循环终止
        if (!(err instanceof DeadLockError)) {
          throw err;
        }
      }
      // 支持相同boField的数据字段自动同步更新机制
      if (this.parent) {
        this.parent.sync(this, this.data);
      }
    }
  }

  getRow(index: number) {
    return this.dataSource.length > index && this.dataSource[index].data;
  }

  async setRow(index: number, rowData = {}, merge = true) {
    let row = this.dataSource.length > index && index >= 0 && this.dataSource[index];
    const oldValue = row && row.data;
    let value;
    if (!merge || !row) {
      if (row) {
        row.replace(rowData);
        this.dataSource.splice(index, 1, row);
      } else {
        row = new RowData(rowData);
        if (index >= 0) {
          this.dataSource[index] = row;
        } else {
          this.dataSource.push(row);
        }
      }
      value = row.data;
    } else {
      row.update(rowData);
      // 按照行触发一次mobx的改变行为
      this.dataSource.splice(index, 1, row);
      value = row.data;
    }
    try {
      await this.fire('rowChanged', { oldValue, value, index, state: row.state, checked: row.checked });
    } catch (err) {
      // 事件循环终止
      if (!(err instanceof DeadLockError)) {
        throw err;
      }
    }
    // 支持相同boField的数据字段自动同步更新机制
    if (this.parent) {
      this.parent.sync(this, this.data);
    }
  }

  // 获取当前正在编辑的行
  getEditRow(): ContainerModel {
    let editRow = this.get('editRow');
    if (!editRow) {
      editRow = new ContainerModel(
        this.columns.reduce(
          (data, column) => ({
            ...data,
            [column.name]: createModel(column),
          }),
          {}
        )
      );
      this.set('editRow', editRow);
    }
    return editRow;
  }

  startEdit(index: number) {}

  stopEdit() {}
}
