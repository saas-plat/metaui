import {
  observable,
  computed,
  action
} from "mobx";
import {
  assignId
} from './util';
import {
  Action
} from './Action';
import {
  Button
} from './Button';
import {
  Container
} from './Container';
import UIStore from '../UIStore';

export class Rule {
  store;
  key;
  name;

  // string: Must be of type string. This is the default type.
  // number: Must be of type number.
  // boolean: Must be of type boolean.
  // method: Must be of type function.
  // regexp: Must be an instance of RegExp or a string that does not generate an exception when creating a new RegExp.
  // integer: Must be of type number and an integer.
  // float: Must be of type number and a floating point number.
  // array: Must be an array as determined by Array.isArray.
  // object: Must be of type object and not Array.isArray.
  // enum: Value must exist in the enum.
  // date: Value must be valid as determined by Date
  // url: Must be of type url.
  // hex: Must be of type hex.
  // email: Must be of type email.
  @observable typeExpr;
  @observable requiredExpr;
  @observable messageExpr;
  @observable enumExpr;
  @observable lenExpr;
  @observable patternExpr;
  @observable whitespaceExpr;
  @observable minExpr;
  @observable maxExpr;

  @observable disableExpr;

  @computed get type() {
    return this.store.execExpr(this.typeExpr);
  }
  set type(typeExpr) {
    this.typeExpr = this.store.parseExpr(typeExpr);
  }
  @computed get required() {
    return this.store.execExpr(this.requiredExpr);
  }
  set required(requiredExpr) {
    this.requiredExpr = this.store.parseExpr(requiredExpr);
  }
  @computed get message() {
    return this.store.execExpr(this.messageExpr) || this.labelText + this.store.t('输入无效');
  }
  set message(messageExpr) {
    this.messageExpr = this.store.parseExpr(messageExpr);
  }
  @computed get enum() {
    return this.store.execExpr(this.enumExpr);
  }
  set enum(enumExpr) {
    this.enumExpr = this.store.parseExpr(enumExpr);
  }
  @computed get len() {
    return this.store.execExpr(this.lenExpr);
  }
  set len(lenExpr) {
    this.lenExpr = this.store.parseExpr(lenExpr);
  }
  @computed get pattern() {
    return this.store.execExpr(this.patternExpr);
  }
  set pattern(patternExpr) {
    this.patternExpr = this.store.parseExpr(patternExpr);
  }
  @computed get whitespace() {
    return this.store.execExpr(this.whitespaceExpr);
  }
  set whitespace(whitespaceExpr) {
    this.whitespaceExpr = this.store.parseExpr(whitespaceExpr);
  }
  @computed get min() {
    return this.store.execExpr(this.minExpr);
  }
  set min(minExpr) {
    this.minExpr = this.store.parseExpr(minExpr);
  }
  @computed get max() {
    return this.store.execExpr(this.maxExpr);
  }
  set max(maxExpr) {
    this.maxExpr = this.store.parseExpr(maxExpr);
  }

  @computed get disable() {
    return this.store.execExpr(this.disableExpr);
  }
  set disable(disableExpr) {
    this.disableExpr = this.store.parseExpr(disableExpr);
  }

  constructor(store, name, typeExpr, messageExpr, requiredExpr, enumExpr, lenExpr,
    patternExpr, whitespaceExpr, minExpr, maxExpr, disableExpr) {
    this.key = assignId('Rule');
    this.store = store;
    this.name = name || this.key;

    this.typeExpr = store.parseExpr(typeExpr);
    this.requiredExpr = store.parseExpr(requiredExpr);
    this.messageExpr = store.parseExpr(messageExpr);
    this.enumExpr = store.parseExpr(enumExpr);
    this.lenExpr = store.parseExpr(lenExpr);
    this.patternExpr = store.parseExpr(patternExpr);
    this.whitespaceExpr = store.parseExpr(whitespaceExpr);
    this.minExpr = store.parseExpr(minExpr);
    this.maxExpr = store.parseExpr(maxExpr);
    this.disableExpr = store.parseExpr(disableExpr);
  }

  static createSchema(obj, options = {}) {
    console.log('create %s rule...', obj.name || obj.type)
    return {
      type: Rule,
      args: [obj.name, obj.type,
        obj.message  ,
        obj.required || options.required,
        obj.enum || options.enum,
        obj.len || options.len,
        obj.pattern || options.pattern,
        obj.whitespace || options.whitespace,
        obj.min || options.min,
        obj.max || options.max
      ]
    };
  }

  toJS() {
    return {
      name: this.name,
      type: this.store.execExpr(this.typeExpr),
      required: this.store.execExpr(this.requiredExpr),
      message: this.store.execExpr(this.messageExpr),
      enum: this.store.execExpr(this.enumExpr),
      len: this.store.execExpr(this.lenExpr),
      pattern: this.store.execExpr(this.patternExpr),
      whitespace: this.store.execExpr(this.whitespaceExpr),
      min: this.store.execExpr(this.minExpr),
      max: this.store.execExpr(this.maxExpr),
    }
  }
}

export class FormItem {
  store;
  key;
  name;

  @observable labelSpanExpr;
  @observable labelTextExpr;
  @observable labelIconExpr;
  @observable tipTextExpr;
  @observable inputItem;
  @observable extraExpr;
  // 描述信息和extra信息是不一样的，长文本
  @observable descriptionExpr;

  @observable allrules;

  // 可以包含一组行为按钮，用来控制常规输入
  @observable allbtns;

  get type() {
    return 'formItem';
  }

  @computed get btns() {
    return this.allbtns.filter(it => it.visible);
  }

  @computed get rules() {
    return this.allrules.filter(it => !it.disable);
  }

  @computed get visible() {
    return this.inputItem.visible;
  }
  set visible(visibleExpr) {
    this.inputItem.visible = visibleExpr;
  }
  @computed get disable() {
    return this.inputItem.disable;
  }
  set disable(disableExpr) {
    this.inputItem.disable = disableExpr;
  }
  @computed get extra() {
    return this.store.execExpr(this.extraExpr);
  }
  set extra(extraExpr) {
    this.extraExpr = this.store.parseExpr(extraExpr);
  }
  @computed get description() {
    return this.store.execExpr(this.descriptionExpr);
  }
  set description(descriptionExpr) {
    this.descriptionExpr = this.store.parseExpr(descriptionExpr);
  }

  @computed get labelSpan() {
    const span = parseInt(this.store.execExpr(this.labelSpanExpr));
    return span !== 0 ? ((span || 4) % 24) : span;
  }
  set labelSpan(labelSpanExpr) {
    this.labelSpanExpr = this.store.parseExpr(labelSpanExpr);
  }
  @computed get labelText() {
    return this.store.execExpr(this.labelTextExpr);
  }
  set labelText(labelTextExpr) {
    this.labelTextExpr = this.store.parseExpr(labelTextExpr);
  }
  @computed get labelIcon() {
    return this.store.execExpr(this.labelIconExpr);
  }
  set labelIcon(labelIconExpr) {
    this.labelIconExpr = this.store.parseExpr(labelIconExpr);
  }
  @computed get tipText() {
    return this.store.execExpr(this.tipTextExpr);
  }
  set tipText(tipTextExpr) {
    this.tipTextExpr = this.store.parseExpr(tipTextExpr);
  }

  constructor(store, name, labelSpanExpr = 6, labelTextExpr = '', labelIconExpr,
    tipTextExpr = '', extraExpr, descriptionExpr, inputItem, rules = [], btns = []) {
    this.key = assignId('FormItem');
    this.store = store;
    this.name = name || this.key;

    this.labelSpanExpr = store.parseExpr(labelSpanExpr);
    this.labelTextExpr = store.parseExpr(labelTextExpr);
    this.labelIconExpr = store.parseExpr(labelIconExpr);
    this.tipTextExpr = store.parseExpr(tipTextExpr);

    this.extraExpr = store.parseExpr(extraExpr);
    this.descriptionExpr = store.parseExpr(descriptionExpr);

    this.inputItem = inputItem;
    this.allrules = rules;
    this.allbtns = btns;
  }

  @action addButton(...items) {
    this.allbtns.push(...items);
  }

  @action removeButton(...names) {
    for (const name of names) {
      const reit = this.allbtns.find(it => it.name === name);
      if (reit) {
        this.allbtns.splice(this.allbtns.indexOf(reit), 1);
      } else {
        console.warn('sub container not exists!', name);
      }
    }
  }

  @action clearButtons() {
    this.allbtns.clear();
  }

  @action addRule(...items) {
    this.allrules.push(...items);
  }

  @action removeRule(...names) {
    for (const name of names) {
      const reit = this.allrules.find(it => it.name === name);
      if (reit) {
        this.allrules.splice(this.allrules.indexOf(reit), 1);
      } else {
        console.warn('sub container not exists!', name);
      }
    }
  }

  @action clearRules() {
    this.allrules.clear();
  }

  static createSchema(obj, options = {}) {
    console.log('create %s form item...', obj.name || obj.type)
    let labelSpan = obj.labelSpan || options.labelSpan;
    let labelText = obj.labelText || obj.label || obj.text;
    if (!labelSpan && !labelText) {
      labelSpan = 0;
    }
    let rules = obj.rules;
    // formitem 和 inputitem 合并一起配置
    if (!rules || rules.length <= 0) {
      rules = [];
      const rule = {};
      // 规则type 和数据类型重复
      // if ('type' in obj) {
      //   rule.type = obj.type;
      // }
      if ('required' in obj) {
        rule.required = obj.required;
      }
      if ('enum' in obj) {
        rule.enum = obj.enum;
      }
      if ('len' in obj) {
        rule.len = obj.len;
      }
      if ('pattern' in obj) {
        rule.pattern = obj.pattern;
      }
      if ('min' in obj) {
        rule.min = obj.min;
      }
      if ('max' in obj) {
        rule.max = obj.max;
      }
      if (Object.keys(rule).length > 0) {
        rules.push(rule);
      }
    }
    return {
      type: FormItem,
      args: [obj.name, labelSpan, labelText, obj.labelIcon || obj.icon,
        obj.tipText || obj.tip, obj.width || options.itemWidth, obj.extra, obj.description,
        UIStore.createSchema(obj),
        // 默认有一条规则obj中尝试查找
        rules.map(it => Rule.createSchema(it, {
          ...obj,
          labelText
        })),
        (obj.btns || []).map(it => Button.createSchema(it, options))
      ]
    };
  }
}

// 表单模型
export class Form {
  store;
  key;

  name;
  @observable typeExpr;

  // from的下一级是container，支持将formitem划分多个区域展示
  @observable allcontainers;

  @computed get type() {
    return this.store.execExpr(this.typeExpr);
  }
  set type(typeExpr) {
    this.typeExpr = this.store.parseExpr(typeExpr);
  }

  @computed get containers() {
    return this.allcontainers.filter(it => it.visible);
  }

  @observable onBeforeChange;
  @observable onChange;
  @observable onAfterChange;

  @observable onBeforeLoad;
  @observable onLoad;
  @observable onAfterLoad;

  @observable onBeforeValidate;
  @observable onValidate;
  @observable onAfterValidate;

  @observable onBeforeSave;
  @observable onSave;
  @observable onAfterSave;

  constructor(store, name, type, containers = [],
    onBeforeChange, onChange, onAfterChange,
    onBeforeLoad, onLoad, onAfterLoad,
    onBeforeValidate, onValidate, onAfterValidate,
    onBeforeSave, onSave, onAfterSave) {
    //assert(store);

    this.key = assignId('Form');
    this.store = store;
    this.name = name || this.key;
    this.allcontainers = containers;
    this.typeExpr = this.store.parseExpr(type);

    this.onBeforeChange = onBeforeChange;
    this.onChange = onChange;
    this.onAfterChange = onAfterChange;

    this.onBeforeValidate = onBeforeValidate;
    this.onValidate = onValidate;
    this.onAfterValidate = onAfterValidate;

    this.onBeforeSave = onBeforeSave;
    this.onSave = onSave;
    this.onAfterSave = onAfterSave;
  }

  @action addContainer(...items) {
    this.allcontainers.push(...items);
  }

  @action removeContainer(...names) {
    for (const name of names) {
      const reit = this.allcontainers.find(it => it.name === name);
      if (reit) {
        this.allcontainers.splice(this.allcontainers.indexOf(reit), 1);
      } else {
        console.warn('form container not exists!', name);
      }
    }
  }

  @action clearContainers() {
    this.allcontainers.clear();
  }

  static createSchema(object = []) {
    console.log('create %s form...', obj.name || obj.type)
    let obj = {};
    if (Array.isArray(object)) {
      obj.containers = object;
    } else {
      const {
        containers,
        name,
        type,
        onChanging,
        onChange,
        onChanged,
        onLoading,
        onLoad,
        onLoaded,
        onValidating,
        onValidate,
        onValidatied,
        onSaveing,
        onSave,
        onSaveed,
        ...other
      } = object;
      obj = {
        containers,
        name,
        type,
        onChanging,
        onChange,
        onChanged,
        onLoading,
        onLoad,
        onLoaded,
        onValidating,
        onValidate,
        onValidatied,
        onSaveing,
        onSave,
        onSaveed
      }
      if (!obj.containers) {
        obj.containers = [other];
        obj.options = {};
      } else {
        obj.options = other;
      }
    }
    if (!Array.isArray(obj.containers)) {
      obj.containers = [obj.containers];
    }
    return {
      type: Form,
      args: [obj.name, obj.type || 'form',
        obj.containers.map(it => Container.createSchema(it, obj.options)),
        Action.createSchema(obj.onChanging), Action.createSchema(obj.onChange), Action.createSchema(obj.onChanged),
        Action.createSchema(obj.onLoading), Action.createSchema(obj.onLoad), Action.createSchema(obj.onLoaded),
        Action.createSchema(obj.onValidating), Action.createSchema(obj.onValidate), Action.createSchema(obj.onValidatied),
        Action.createSchema(obj.onSaveing), Action.createSchema(obj.onSave), Action.createSchema(obj.onSaveed)
      ]
    };
  }
}
