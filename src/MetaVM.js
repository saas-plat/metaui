import {
  autorun,
  action,
  toJS
} from "mobx";
import Schema from 'async-validator';
import feedback from './feedback';
import {
  createObject,
  createMapping,
  createProxy,
  maptoDto,
  maptoVM,
  readonly
} from './utils';
import ModelSchema from './VMSchema';
import EventModel from './EventModel';
import RuleSet from './RuleSet';

// 单据的容器级别的视图模型
// 和metaui的组件级别视图模型不是一个级别
// 主要区别就是需要根据schema创建字段的类型, 而不是submodel
export default class MetaVM {
  static vmodels = new Map();

  static getType(type) {
    const Model = this.vmodels.get(type) || MetaVM;
    return Model;
  }

  static register(Models) {
    const keys = Object.keys(Models);
    for (const name of keys) {
      if (!name) {
        console.error('model can not be register');
        return;
      }
    }
    for (const name of keys) {
      let type = name;
      // 首字母大写
      type = type[0].toUpperCase() + type.substr(1);
      this.vmodels.set(type, Models[name]);
    }
  }

  static createType(BaseType, name, schema, rules, opts = {}) {
    schema = schema instanceof ModelSchema ? schema : ModelSchema.create(schema);
    createMapping(schema.fields, name);
    const init = createObject(schema.fields);
    const validator = new Schema(schema.fields);
    const ruleset = new RuleSet(name, rules);
    const SpecificModel = class extends BaseType {
      constructor() {
        super(init, schema);
        // 创建一个代理, 赋值和获取值都根据schema控制
        const proxy = createProxy(init, this, schema.fields, name);
        // 数据改变规则
        this.dispose = autorun(() => {
          console.log('execute data rule...');
          ruleset.execute([this]);
          console.log('execute data complated');
        });
        return proxy;
      }

      async onAction(action, data, ...objs) {
        const nsActions = opts.ns ? [
          opts.ns + '.' + action, // 特定范围所有行为
          opts.ns + '.' + BaseType.name + '.' + action, // 特定范围类型行为
          opts.ns + '.' + name + '.' + action, // 特定范围内行为
        ] : [];
        return await ruleset.execute([
          ...[action, // 所有行为
            BaseType.name + '.' + action, // 特定类型行为
            name + '.' + action, // 特定对象行为
          ].concat(nsActions).map(action => (new EventModel(action, data))),
          this,
          ...objs
        ]);
      }

      validate() {
        return new Promise((resolve, reject) => {
          this.errors.length = 0;
          validator.validate(this.toJS(), (errors) => {
            if (errors) {
              this.errors = this.errors.concat(errors);
              errors.forEach(err => feedback.message(err.message, 3, 'error'));
              return reject(false);
            }
            this.executeRule([new EventModel('model.validate'), this]).then(() => {
              resolve(this.errors.length === 0);
            }).catch(err => {
              console.warn(err.message);
              return reject(false);
            })
          });
        });
      }

      @action merge(dto) {
        // map必须直接到this需要固定的结构
        maptoVM(name, dto, this);
      }

      @action restore(data) {
        this.merge(data || init);
      }

      @action new() {
        this.restore();
      }

      cutJS() {
        // 裁减掉ui状态字段, 只保留数据字段, 适合向后端传送数据
        // 引用类型数据结构只保留ID
        const dto = createObject(schema.fields, true);
        maptoDto(name, this.toJS(), dto);
        //debug(this.toJS(), '=>', dto);
        return dto;
      }

      toJS() {
        return toJS(this);
      }
    }

    readonly(SpecificModel, 'name', name);
    return SpecificModel;
  }

  static create(Type) {
    return new Type();
  }

}
