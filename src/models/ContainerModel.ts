import { runInAction, action, computed } from 'mobx';
import { DataModel, SetOptions } from './BaseModel';
import { GridModel } from './GridModel';
import { TreeModel } from './TreeModel';

export enum ModeStatus {
  Add,
  Edit,
  ReadOnly,
}

interface ValidateFields {
  [key: string]: string;
}

// 容器模型，包含一组数据字段，是所有视图模型的基类
export class ContainerModel extends DataModel {
  get fromVM(): ContainerModel {
    return this.get('params').fromVM;
  }

  get pageStack(): string[] {
    return this.get('pageStack');
  }
  @computed get curPage(): string {
    const stack = this.get('pageStack');
    return stack[stack.length - 1];
  }

  get validateMsg(): ValidateFields {
    return this.get('validateMsg');
  }

  get boName(): string {
    return this.get('bo');
  }

  get mode(): ModeStatus {
    return this.get('mode');
  }

  async setMode(mode: ModeStatus) {
    await this.set('mode', mode);
  }

  getDirtyData(necessary = true) {
    var dirtyData = {};
    var property, isDirty;
    this.dataProps.forEach((propertyName) => {
      property = this.get(propertyName);
      if (
        !(property instanceof DataModel) ||
        property.get('needCollect') === false ||
        property.get('needClear') === false
      )
        return;
      if (necessary !== false && property.get('mustSelect')) {
        const value = property.data;
        dirtyData[propertyName] = value;
        isDirty = true;
      } else {
        const value = property.getDirtyData(necessary);
        if (value === undefined) return;
        dirtyData[propertyName] = value;
        isDirty = true;
      }
    });
    if (isDirty) return dirtyData;
  }

  getAllData() {
    var rawData = {};
    var property;
    this.dataProps.forEach((propertyName) => {
      property = this.get(propertyName);
      if (
        !(property instanceof DataModel) ||
        property.get('needCollect') === false ||
        property.get('needClear') === false
      )
        return;

      var value = (<any>property).allData ? (<any>property).allData() : property.data;
      rawData[propertyName] = value;
    });
    return rawData;
  }

  get originalData() {
    var originalData = {};
    var property;
    this.dataProps.forEach((propertyName) => {
      property = this.get(propertyName);
      if (
        !(property instanceof DataModel) ||
        property.get('needCollect') === false ||
        property.get('needClear') === false
      )
        return;
      var value = property.get('originalData');
      originalData[propertyName] = value;
    });
    return originalData;
  }

  constructor(data?: any) {
    super({ pageStack: [], ...data });
  }

  collectData(all = true) {
    return all ? this.getAllData() : this.getDirtyData();
  }

  get data() {
    return this.collectData(true);
  }

  get gridModel(): GridModel {
    return this.getGridModel();
  }

  getGridModel(propertyName?: string): GridModel {
    if (propertyName) return this.get(propertyName);
    var gridModel = this.get('gridModel');
    if (gridModel) return gridModel;
    for (const name of this.dataProps) {
      gridModel = this.get(name);
      if (gridModel instanceof GridModel) {
        this.set('gridModel', gridModel);
        return gridModel;
      }
    }
  }

  get gridModels(): GridModel[] {
    var gridModels = [];
    for (const name of this.dataProps) {
      var gridModel = this.get(name);
      if (gridModel instanceof GridModel) gridModels.push(gridModel);
    }
    return gridModels;
  }

  get treeModel(): TreeModel {
    return this.getTreeModel();
  }

  getTreeModel(propertyName?: string): TreeModel {
    if (propertyName) return this.get(propertyName);
    var treeModel = this.get('treeModel');
    if (treeModel) return treeModel;
    for (const name of this.dataProps) {
      treeModel = this.get(name);
      if (treeModel instanceof TreeModel) {
        this.set('treeModel', treeModel);
        return treeModel;
      }
    }
  }

  @action async setReadOnly(value) {
    var property;
    for (const propertyName of this.dataProps) {
      property = this.get(propertyName);
      if (!(property instanceof DataModel)) return;
      await property.setReadOnly(value);
    }
  }

  @action async setDisabled(value) {
    var property;
    for (const propertyName of this.dataProps) {
      property = this.get(propertyName);
      if (!(property instanceof DataModel)) return;
      await property.setDisabled(value);
    }
  }

  @action async setIsDirty(value) {
    var property;
    for (const propertyName of this.dataProps) {
      property = this.get(propertyName);
      if (
        !(property instanceof DataModel) ||
        property.get('needCollect') === false ||
        property.get('needClear') === false
      )
        return;
      await property.setIsDirty(value);
    }
  }

  get viewMeta() {
    return this.cache['viewMeta'];
  }

  set viewMeta(value) {
    this.cache['viewMeta'] = value;
  }

  @action async loadData(data, dirty = false) {
    await this.clear(false);
    await this.setData(data);
    await this.setIsDirty(dirty);
  }

  @action async setData(data, options?: SetOptions) {
    for (var propertyName in data) await this.addProperty(propertyName, data[propertyName]);
  }

  @action initData(data) {
    for (var propertyName in data) {
      data[propertyName].parent = this;
      data[propertyName].name = propertyName;
      // if (data[propertyName].afterInit) data[propertyName].afterInit();
      this.dataProps.add(propertyName);
      this.props.set(propertyName, data[propertyName]);
    }
  }

  @action async set(propertyName, value, options?: SetOptions) {
    if (value instanceof DataModel) {
      value.parent = this;
      value.name = propertyName;
      if (value.afterInit) await value.afterInit();
    }
    await super.set(propertyName, value, options);
  }

  @action async addProperty(propertyName, value) {
    var property = this.get(propertyName);
    property && property.setData
      ? await property.setData(value)
      : await this.set(propertyName, value, { isDataField: true });
  }

  @action removeProperty(propertyName) {
    this.dataProps.delete(propertyName);
    this.props.delete(propertyName);
  }

  @action clear(useDefault = true) {
    this.dataProps.forEach((propertyName) => {
      const property = this.get(propertyName);
      if (!(property instanceof DataModel) || property.get('needClear') === false) return;
      property.clear(useDefault);
    });
  }

  @action async validate(cancel = true): Promise<Boolean> {
    var property;
    var invalidFields = {};
    await this.set('validateMsg', null);
    this.dataProps.forEach((propertyName) => {
      property = this.get(propertyName);
      //过滤区高级查询不做校验
      if (propertyName == 'filterModal') return;
      // remove temp: || property.get('needCollect') === false
      if (!(property instanceof DataModel) || property.get('needClear') === false) return;
      // 对多语校验时多传入一个语种信息，便于判空校验
      // var locale = cb.rest.AppContext.locale || 'zh_CN'; //当前语种从哪里获取
      // if (property.get('type') && property.get('type').toLowerCase() == 'inputmultilang') {
      //   if (property.validate(cancel, locale)) return;
      // } else {
      if (property.validate(cancel)) return;
      // }
      invalidFields[property.name] = property.get('label') || property.get('name') || property.get('fieldName');
    });
    // console.error(invalidMsgs);
    // return invalidMsgs.join(';');
    if (!cancel) this.execute('afterValidate', invalidFields);
    if (Object.keys(invalidFields).length && !cancel) {
      this.execute('invalidFieldsChange', invalidFields);
      await this.setValidateMsg(invalidFields);
      return false;
    } else {
      return true;
    }
  }
}
