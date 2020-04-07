import {
  computed,
  action,
} from 'mobx';
import Model from './Model';

// 报表图表
export default class ReportModel extends Model {

  @computed get headerRowCount(){

  }

  @computed get columnCount(){

  }

  @computed get fixedColumnCount(){
    if (this.fixedIndex === undefined){
      return 0;
    }
    return this.fixedIndex + 1;
  }

  getColumnWidth(columnIndex){

  }

  getColumn(rowIndex, columnIndex){

  }

  getCell(rowIndex, columnIndex){

  }

  isRowLoaded(rowIndex){

  }

  @action loadData(rowIndex, size){

  }

  @action selectCell(rowIndex, columnIndex){

  }
}
