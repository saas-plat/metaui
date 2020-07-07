import {
  autorun,
  action,
  toJS
} from "mobx";
import Schema from 'async-validator';
import feedback from './feedback';
import {
  createProxy,
  readonly
} from './utils';
import EventModel from './EventModel';
import {
  t
} from './i18n';

// 单据的容器级别的视图模型
// 和metaui的组件级别视图模型不是一个级别
// 主要区别就是需要根据schema创建字段的类型, 而不是submodel
export default class MetaVM {

  static vmodels = new Map();

  static getType = (type) => {
    const Model = MetaVM.vmodels.get(type);
    return Model;
  }

  static register = (Models) => {
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
      MetaVM.vmodels.set(type, Models[name]);
    }
  }

  static createModel(name, schema, opts = {}) {
    const BaseType = MetaVM.getType(schema.type);
    if (!BaseType) {
      throw new Error(t('{{type}}视图模型类型未定义', schema));
    }
    schema.createMapping(name);
    const init = schema.createObject();
    const validator = new Schema(schema.fields);
    const SpecificModel = class extends BaseType {
      constructor() {
        super(init, schema);
        // 创建一个代理, 赋值和获取值都根据schema控制
        const proxy = createProxy(init, this, schema.fields, name);
        // 数据改变规则
        this.dispose = autorun(() => {
          console.log('execute data rule...');
          this.onAction();
          console.log('execute data complated');
        });
        return proxy;
      }

      async onAction(action, data, ...objs) {
        if (!opts.onAction) {
          return;
        }
        const actions = action ? [action, // 所有行为
          schema.type + '.' + action, // 特定类型行为
          name + '.' + action, // 特定对象行为
        ] : [];
        const nsActions = opts.ns && action ? [
          opts.ns + '.' + action, // 特定范围所有行为
          opts.ns + '.' + schema.type + '.' + action, // 特定范围类型行为
          opts.ns + '.' + name + '.' + action, // 特定范围内行为
        ] : [];
        return await opts.onAction([
          ...actions.concat(nsActions).map(action => (new EventModel(action, data))),
          this, ...objs
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
        schema.maptoModel(dto, this);
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
        const dto = schema.createObject({
          cutRef: true
        });
        schema.maptoDto(this.toJS(), dto);
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
