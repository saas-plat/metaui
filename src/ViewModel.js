import {
  extendObservable,
  action,
  toJS
} from "mobx";
import Schema from 'async-validator';
import _get from 'lodash/get';
import _has from 'lodash/has';
import _set from 'lodash/set';
import feedback from './feedback';
import {
  createValue,
  createMapping,
  createObject,
  maptoDto,
  maptoVM,
  readonlyDeep,
} from './util';
import ModelSchema from './ModelSchema';

export const schemaSymbol = Symbol("schema");
export const validatorSymbol = Symbol("validator");
export const pageSymbol = Symbol("store");
export const keySymbol = Symbol("key");

// 单据的容器级别的视图模型
// 和metaui的组件级别视图模型不是一个级别
export default class ViewModel {

  hasValue(keyPath) {
    return _has(this, keyPath);
  }

  getValue(key) {
    return _get(this, key);
  }

  // 对象更新，要是简单类型直接赋值即可a.b=100
  @action setValue(key, value) {
    const subObj = createValue(this[keySymbol], this[schemaSymbol].fields, key, value);
    //debug('setValue', key);
    _set(this, key, subObj);
    //debug(_get(this, key))
    return subObj;
  }

  // 数组追加对象
  @action pushValue(key, value) {
    const subObj = createValue(this[keySymbol], this[schemaSymbol].fields, key, value);
    _get(this, key).push(subObj);
    return subObj;
  }

  // 插入一个对象，默认前插入
  @action insertValue(key, value, index = 0) {
    const subObj = createValue(this[keySymbol], this[schemaSymbol].fields, key, value);
    _get(this, key).splice(index, 0, subObj);
    return subObj;
  }

  constructor(store, schema, key) {
    // 内置变量不可枚举
    readonlyDeep(this, pageSymbol, store);
    readonlyDeep(this, schemaSymbol, schema);
    readonlyDeep(this, validatorSymbol, new Schema(schema.fields));
    readonlyDeep(this, keySymbol, key);
    createMapping(this[schemaSymbol], key);
    // 扩展可观察对象
    extendObservable(this, createObject({}, schema.fields));
  }

  validate() {
    return new Promise((resolve, reject) => {
      this.errors.length = 0;
      this[validatorSymbol].validate(this.toJS(), (errors) => {
        if (errors) {
          this.errors = this.errors.concat(errors);
          errors.forEach(err => feedback.message(err.message, 3, 'error'));
          return reject(false);
        }
        this[pageSymbol].store.executeRule(this[pageSymbol].template.ruleset, {
          name: 'model.validate'
        }, {
          viewModel: this
        }).then(() => {
          resolve(this.errors.length === 0);
        }).catch(err => {
          console.warn(err.message);
          return reject(false);
        })
      });
    });
  }

  @action new() {
    this.restore();
  }

  @action merge(dto) {
    // map必须直接到this需要固定的结构
    maptoVM(this[keySymbol], dto, this);
  }

  @action restore(initData) {
    this.merge(initData || createObject({}, this[schemaSymbol]));
  }

  cut() {
    // 裁剪引用类型数据结构只保留ID
    const dto = createObject({}, this[schemaSymbol], true);
    maptoDto(this[keySymbol], this.toJS(), dto);
    //debug(this.toJS(), '=>', dto);
    return dto;
  }

  toJS() {
    return toJS(this);
  }

  static createSchema(obj) {
    return ModelSchema.create(obj);
  }

  static create(store, schema, id = 'VM' + new Date().getTime()) {
    if (!(schema instanceof ModelSchema)) {
      schema = ViewModel.create(schema);
    }
    return new ViewModel(store, schema, id);
  }
}
