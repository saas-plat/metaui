import {
  computed,
  observable,
  runInAction,
  action,
} from 'mobx';
import _keys from 'lodash/keys';
import Model from './Model';
import SimpleModel from './SimpleModel';
import ListModel from './ListModel';

// 三维表模型
export default class TableModel extends Model {
  @observable columns = [];
  @observable rows = [];

  constructor(store, {columns = {}, data = [], ...props}) {
    super(store, props);
    this.columns = _keys(columns).map(key => new SimpleModel({
      id: key,
      ...columns[key]
    }));
    this.rows = data.map(it => new ListModel(it))
  }

  // 校验函数 合法性、必输项
  validate() {

  }

  getDirtyData() {}
  // 获取脏数据

  getDirtyRowIndexes() {}
  // 获取脏数据的行号集合

  getData() {}
  // 获取所有数据

  getColumns(fields) {}
  // 批量获取栏目信息
  // fields为所需获取栏目的fieldname集合
  // 可选参数，如不传，则获取所有栏目的信息

  getColumns(field) {}
  // 获取单列栏目的信息
  // field为所需获取栏目的fieldname

  hasColumn(field) {}
  // 判断函数，判断是否包含该栏目
  // field为所要判断栏目的fieldname

  setDirty(dirty) {}
  // 设置脏数据取值范围 默认为false为收集数据时只收集脏数据。
  // dirty 类型Boolean

  //传入true则收集数据时不区别脏数据，为完整数据。

  setReadOnly(value) {}
  // 设置grid属性为是否可编辑状态
  // value true or false

  setFocusedRowIndex(index) {}
  // 设置焦点行
  // index 需要设置的焦点行行号

  getCellValue(rowIndex, cellName) {}
  // 获取单元格value值
  // rowIndex 行号
  //cellName 列名（fieldname）

  setCellValue(rowIndex, cellName, value, check, blur) {}
  // 设置单元格value值
  // rowIndex 行号
  // cellName 列名（fieldname）
  // value 值
  // check boolean型 内部调用参数 可不传
  // blur 为true时，单元格数据改变后变为不可编辑状态

  getRowState(rowIndex, name) {}
  // 获取行状态
  // rowIndex 行号
  //name 状态名

  //获取行1的disabled状态
  //model. getRowState(1,’disabled’)

  setRowState(rowIndex, name, value) {}
  // 设置当前行的状态，例如禁用、只读、样式
  //  rowIndex 行号
  // name 状态名
  // value 状态值

  //设置第一行为禁用状态
  //gridModel.setRowState(1,disabled,true);
  //设置第一行外层的className为"public_fixedDataTableRow_red".
  //gridModel.setRowState(1, 'className', 'red');

  getColumnState(cellName, name) {}
  // 获取列状态
  // cellName 列名(fieldname)
  //name 状态名

  //model. getColumnState(2,’readOnly’)

  setColumnState(cellName, name, value) {}
  // 设置列状态
  // cellName 列名(fieldname)
  // name 状态名
  // value 状态值

  //设置inventory列的readOnly状态为true
  // model. setColumnState(‘inventory’,’readOnly’,true)

  setColumnValue(cellName, value, check) {}
  // 设置整列数据的值
  // cellName 列名(fieldname)
  // value 列值
  // check boolean型 内部调用参数 可不传

  getCellState(rowIndex, cellName, name) {}
  // 获取单元格状态
  // rowIndex 行号
  // cellName 列名
  // name 状态名

  //获取第一行inventory列的readOnly状态的值
  // model. getCellState (1,’ inventory’,’readOnly’)

  setCellState(rowIndex, cellName, name, value) {}
  // 设置单元格状态
  // rowIndex 行号
  // cellName 列名(fieldname)
  // name 状态名
  // value 状态值

  //设置第1行inventory列的readOnly状态为true
  // model. setCellState(1,’ inventory’,’readOnly’,true)

  setColumns(columns, fieldNames) {}
  // 设置grid栏目
  // columns 栏目集合
  // fieldNames fieldname集合(可不传)

  clear() {}
  // 清除全部数据

  setDataSource(proxyConfig, queryParams, callback) {}
  // 如果GridModel中dataSourceMode为local则proxyConfig参数传递为真实数据。
  // 否则proxyConfig参数传递服务请求地址，queryParams传递请求参数，callback传递回调函数。

  //dataSourceMode为local
  // model. setDataSource(GridData)
  //dataSourceMode不为local
  // model.setDataSource(‘bill/list.do’,{‘id’:1},function(result){})

  // load (proxyConfig, params, callback)
  // 调用方法同setDataSource方法中dataSourceMode不为local的情况

  setPageSize(pageSize) {}
  // 设置grid分页的页大小
  //  pageSize 页大小

  setPageIndex(pageIndex) {}
  // 设置grid分页中的页码
  // pageIndex 页码

  getPageSize() {}
  // 获取当前grid分页的页大小

  select(rowIndexes) {}
  // 设置grid选中行
  //  rowIndexes 行号集合
  // 示例： model.select([1,2,3]) 设置grid选中行号为1,2,3行

  getPageIndex() {}
  // 获取grid分页中的当前页码

  unselect(rowIndexes) {}
  // 设置grid取消选中的行
  //  rowIndexes 行号集合

  selectAll() {}
  // 选中所有行

  unselectAll() {}
  // 取消选中所有行

  getSelectedRows() {}
  // 获取grid中已选中行的数据

  getSelectedRowIndexes() {}
  // 获取grid中已选中行的行号

  getRows() {
    return this.rows.map(it => it.getValue());
  }

  updateRow(rowIndex, rowData) {}
  // 更新行数据
  // rowIndex 行号
  // rowData 行数据

  insertRow(rowIndex, rowData) {}
  // grid插行功能
  // rowIndex 行号
  // rowData 行数据

  //在第三行下插入行，行数据为rowData
  // model.insertRow(3,rowData)

  insertRows(rowIndex, rowDatas) {}
  // grid批量插行功能
  // rowIndex 行号
  // rowDatas 行数据

  //在第三行下插入rowDatas.length行，数据为rowDatas
  // model.insertRow(3,rowDatas)

  appendRow(rowData) {}
  // grid增行功能
  //  rowData 行数据

  deleteRows(rowIndexes) {}
  // grid 删行功能
  // rowIndexes 行号集合

  //删除grid中第行号为1,2的行
  // model.deleteRows([1,2])

  getRowsByIndexes(rowIndexes) {}
  // 根据行号获取grid中数据
  // rowIndexes 行号集合

  getRow(rowIndex) {}
  // 根据行号获取行数据
  // rowIndex 单个行号


}
