import {
  observable,
  computed
} from "mobx";
import {
  assignId
} from './util';
import {
  Action
} from './Action';
import translater from '../translater';

const ItemDefaultWidth = 360;

export class Rule {
  store;
  key;

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
    return this.store.execExpr(this.messageExpr);
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

  constructor(store, typeExpr, messageExpr, requiredExpr, enumExpr, lenExpr,
    patternExpr, whitespaceExpr, minExpr, maxExpr) {
    this.key = assignId('Rule');
    this.store = store;

    this.typeExpr = store.parseExpr(typeExpr);
    this.requiredExpr = store.parseExpr(requiredExpr);
    this.messageExpr = store.parseExpr(messageExpr);
    this.enumExpr = store.parseExpr(enumExpr);
    this.lenExpr = store.parseExpr(lenExpr);
    this.patternExpr = store.parseExpr(patternExpr);
    this.whitespaceExpr = store.parseExpr(whitespaceExpr);
    this.minExpr = store.parseExpr(minExpr);
    this.maxExpr = store.parseExpr(maxExpr);
  }

  static create(store, obj, options = {}) {
    return new Rule(store,
      obj.type,
      obj.message || (options.labelText + translater.t('输入无效')),
      obj.required || options.required,
      obj.enum || options.enum,
      obj.len || options.len,
      obj.pattern || options.pattern,
      obj.whitespace || options.whitespace,
      obj.min || options.min,
      obj.max || options.max
    );
  }

  toJS() {
    return {
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

  @observable labelSpanExpr;
  @observable labelTextExpr;
  @observable labelIconExpr;
  @observable tipTextExpr;
  @observable inputItem;
  @observable widthExpr; // flowlayout每项宽度
  @observable extraExpr;

  @observable rules;

  get type() {
    return 'formItem';
  }

  @computed get width() {
    const v = this.store.execExpr(this.widthExpr);
    if (v.indexOf('%') > -1) {
      return v;
    }
    const vv = parseFloat(v);
    return vv !== 0 ? (vv || ItemDefaultWidth) : vv;
  }

  @computed get visible() {
    return this.inputItem.visible;
  }
  set visible(visibleExpr) {
    this.inputItem.visible = visibleExpr;
  }
  @computed get disabled() {
    return this.inputItem.disabled;
  }
  set disabled(disabledExpr) {
    this.inputItem.disabled = disabledExpr;
  }
  @computed get extra() {
    return this.store.execExpr(this.extraExpr);
  }
  set extra(extraExpr) {
    this.extraExpr = this.store.parseExpr(extraExpr);
  }

  @computed get state() {
    return this.store.state;
  }

  @computed get labelSpan() {
    const span = parseInt(this.store.execExpr(this.labelSpanExpr));
    return span !== 0 ? ((span || 4) % 24) : span;
  }

  @computed get labelText() {
    return this.store.execExpr(this.labelTextExpr);
  }
  @computed get labelIcon() {
    return this.store.execExpr(this.labelIconExpr);
  }
  @computed get tipText() {
    return this.store.execExpr(this.tipTextExpr);
  }

  constructor(store, labelSpanExpr = 6, labelTextExpr = '', labelIconExpr,
    tipTextExpr = '', widthExpr = '', extraExpr, inputItem, rules = []) {
    this.key = assignId('FormItem');
    this.store = store;
    this.labelSpanExpr = store.parseExpr(labelSpanExpr);
    this.labelTextExpr = store.parseExpr(labelTextExpr);
    this.labelIconExpr = store.parseExpr(labelIconExpr);
    this.tipTextExpr = store.parseExpr(tipTextExpr);

    this.widthExpr = store.parseExpr(widthExpr);
    this.extraExpr = store.parseExpr(extraExpr);

    this.inputItem = inputItem;
    this.rules = rules;
  }

  static create(store, obj, options = {}) {
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
    return new FormItem(store, labelSpan, labelText, obj.labelIcon || obj.icon,
      obj.tipText || obj.tip, obj.width || options.itemWidth, obj.extra,
      store.createViewModel(obj),
      // 默认有一条规则obj中尝试查找
      rules.map(it => Rule.create(store, it, {
        ...obj,
        labelText
      })));
  }
}

export class Layout {
  store;
  key;

  @observable name;
  @observable type; // flowlayout   gridlayout
  @observable columnCountExpr; // gridlayout时列数
  @observable itemWidthExpr; // flowlayout每项宽度

  @observable items;

  @computed get state() {
    return this.store.state;
  }

  @computed get itemWidth() {
    return parseFloat(this.store.execExpr(this.itemWidthExpr)) || ItemDefaultWidth;
  }

  @computed get columnCount() {
    const count = parseInt(this.store.execExpr(this.columnCountExpr));
    return count !== 0 ? (count || 4) : count;
  }

  constructor(store, name, type = 'flow', columnCountExpr = 4, itemWidthExpr = ItemDefaultWidth, items = []) {
    this.key = assignId('Layout');
    this.store = store;
    this.name = name || this.key;
    this.type = type;

    this.columnCountExpr = store.parseExpr(columnCountExpr);
    this.itemWidthExpr = store.parseExpr(itemWidthExpr);

    this.items = items;
  }

  static create(store, obj, options = {}) {
    return new Layout(store, obj.name, obj.type, obj.columnCount, obj.itemWidth,
      (obj.items || []).map(it => FormItem.create(store, it, {
        itemWidth: obj.itemWidth,
        ...options
      })));
  }
}

export class Group {
  store;
  key;

  @observable name;
  @observable textExpr;
  @observable iconExpr;
  @observable disableExpr;
  @observable visibleExpr;
  @observable panel;

  get type() {
    return 'tab';
  }

  @computed get state() {
    return this.store.state;
  }

  @computed get text() {
    return this.store.execExpr(this.textExpr);
  }
  @computed get icon() {
    return this.store.execExpr(this.iconExpr);
  }
  @computed get disable() {
    return this.store.execExpr(this.disableExpr);
  }
  @computed get visible() {
    return this.store.execExpr(this.visibleExpr);
  }

  constructor(store, name, text, icon, disableExpr = false, visibleExpr = true, panel) {
    this.key = assignId('Group');
    this.store = store;
    this.name = name || this.key;
    this.textExpr = this.store.parseExpr(text);
    this.iconExpr = this.store.parseExpr(icon);
    this.disableExpr = store.parseExpr(disableExpr);
    this.visibleExpr = store.parseExpr(visibleExpr);
    this.panel = panel;
  }

  static create(store, obj, options = {}) {
    let tab;
    if (obj.panel || obj.type === 'tab') {
      tab = obj;
    } else {
      tab = {
        panel: obj
      };
    }
    return new Group(store, obj.name, obj.text, obj.icon, obj.disable,
      obj.visible, Layout.create(store, tab.layout || tab.panel, options));
  }

}

export class Container {
  store;
  key;

  @observable name;
  @observable textExpr;
  @observable iconExpr;
  @observable disableExpr;
  @observable visibleExpr;

  @observable groups;

  get type() {
    return 'group';
  }

  @computed get state() {
    return this.store.state;
  }

  @computed get text() {
    return this.store.execExpr(this.textExpr);
  }
  @computed get icon() {
    return this.store.execExpr(this.iconExpr);
  }
  @computed get disable() {
    return this.store.execExpr(this.disableExpr);
  }
  @computed get visible() {
    return this.store.execExpr(this.visibleExpr);
  }

  constructor(store, name, text, icon, disableExpr = false, visibleExpr = true, groups = []) {
    this.key = assignId('Container');
    this.store = store;
    this.name = name || this.key;
    this.textExpr = this.store.parseExpr(text);
    this.iconExpr = this.store.parseExpr(icon);
    this.disableExpr = store.parseExpr(disableExpr);
    this.visibleExpr = store.parseExpr(visibleExpr);
    this.groups = groups;
  }

  static create(store, obj, options = {}) {
    let groups = [];
    if (obj.type === 'groups') {
      groups = obj.items;
    } else {
      groups.push({
        text: '',
        panel: obj
      });
    }
    return new Container(store, obj.name, obj.title || obj.text, obj.icon,
      obj.disable, obj.visible, groups.map(it => Group.create(store, it, options)));
  }
}

export class Voucher {
  store;
  key;

  @observable name;
  @observable containers;

  @observable labelSpanExpr;

  @observable onBeforeChange;
  @observable onChange;
  @observable onAfterChange;

  get type() {
    return 'form';
  }

  @computed get state() {
    return this.store.state;
  }

  @computed get labelSpan() {
    // 24列布局
    const span = parseInt(this.store.execExpr(this.labelSpanExpr));
    return span !== 0 ? ((span || 4) % 24) : span;
  }

  constructor(store, name, labelSpanExpr = 4, containers = [],
    onBeforeChange, onChange, onAfterChange) {
    //assert(store);

    this.key = assignId('Form');
    this.store = store;
    this.name = name || this.key;
    this.containers = containers;
    this.labelSpanExpr = store.parseExpr(labelSpanExpr);

    this.onBeforeChange = onBeforeChange;
    this.onChange = onChange;
    this.onAfterChange = onAfterChange;
  }

  static create(store, object = []) {
    let containers, name, labelSpan,
      onChanging, onChange, onChanged;

    if (Array.isArray(object)) {
      containers = object;
    } else if (object.containers) {
      containers = object.containers;
      name = object.name;
      labelSpan = object.labelSpan;
      onChanging = object.onChanging;
      onChange = object.onChange;
      onChanged = object.onChanged;
    } else {
      containers = [object];
    }
    if (!Array.isArray(containers)) {
      containers = [containers];
    }
    return new Form(store, name, labelSpan, containers.map(it => Container.create(store, it, {
        labelSpan
      })),
      Action.create(store, onChanging), Action.create(store, onChange), Action.create(store, onChanged));
  }
}

export class Form {
  store;
  key;

  @observable name;
  @observable layout; // horizontal vertical inline

  @observable labelSpanExpr;

  @observable items;

  @computed get state() {
    return this.store.state;
  }

  @computed get labelSpan() {
    const span = parseInt(this.store.execExpr(this.labelSpanExpr));
    return span !== 0 ? ((span || 4) % 24) : span;
  }

  constructor(store, name, layout = 'horizontal', labelSpanExpr, items = []) {
    this.key = assignId('Form');
    this.store = store;
    this.name = name || this.key;
    this.layout = layout;
    this.labelSpanExpr = store.parseExpr(labelSpanExpr);
    this.items = items;
  }

  static create(store, obj) {
    return new Form(store, obj.name, obj.layout, obj.labelSpan || 6,
      (obj.items || []).map(it => FormItem.create(store, it, {
        labelSpan: obj.labelSpan
      })));
  }
}
