import {
  reaction,
}
from 'mobx';
import Schema from 'async-validator';
import feedback from './feedback';
import {
  createObject,
  readonly,
} from './util';
import Model from './models/Model';
import ModelSchema from './ModelSchema';
import EventModel from './EventModel';
import RuleSet from './RuleSet';

// 单据的容器级别的视图模型
// 和metaui的组件级别视图模型不是一个级别
export default class MetaModel extends Model {
  static bziModels = new Map();

  static getType(type) {
    const Model = this.bziModels.get(type) || MetaModel;
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
      this.bziModels.set(type, Models[name]);
    }
  }

  static createType(BaseType, name, schema, rules, opts = {}) {
    schema = schema instanceof ModelSchema ? schema : ModelSchema.create(schema);
    const init = createObject({}, schema.fields);
    const validator = new Schema(schema.fields);
    const ruleset = new RuleSet(name, rules);
    const SpecificModel = class extends BaseType {
      constructor(data) {
        super(data || init);
        // 数据改变规则
        this.disposer = reaction(() => this.toJS(),
          () => {
            console.log('execute data rule...');
            ruleset.execute([this]);
            console.log('execute data complated');
          }
        );
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
    }
    readonly(SpecificModel, 'name', name);
    readonly(SpecificModel, 'fields', schema.fields);
    return SpecificModel;
  }

  static create(Type){
    return new Type();
  }

}
