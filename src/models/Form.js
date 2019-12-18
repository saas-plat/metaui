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
import UISchema from '../UISchema';

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
  @observable setTypeExpr;
  @observable requiredExpr;
  @observable setRequiredExpr;
  @observable messageExpr;
  @observable setMessageExpr;
  @observable enumExpr;
  @observable setEnumExpr;
  @observable lenExpr;
  @observable setLenExpr;
  @observable patternExpr;
  @observable setPatternExpr;
  @observable whitespaceExpr;
  @observable setWhitespaceExpr;
  @observable minExpr;
  @observable setMinExpr;
  @observable maxExpr;
  @observable setMaxExpr;

  @observable disableExpr;
  @observable setDisableExpr;

  @computed get type() {
    return this.store.execExpr(this.typeExpr);
  }
  set type(value) {
    if (this.setType) {
      return this.store.setViewModel(this.setType, value);
    }
    this.typeExpr = UIStore.parseExpr(value);
  }
  @computed get setType() {
    return this.store.execExpr(this.setTypeExpr);
  }
  set setType(setValue) {
    this.setTypeExpr = UIStore.parseExpr(setValue);
  }
  @computed get required() {
    return this.store.execExpr(this.requiredExpr);
  }
  set required(value) {
    if (this.setRequired) {
      return this.store.setViewModel(this.setRequired, value);
    }
    this.requiredExpr = UIStore.parseExpr(value);
  }
  @computed get setRequired() {
    return this.store.execExpr(this.setRequiredExpr);
  }
  set setRequired(setValue) {
    this.setRequiredExpr = UIStore.parseExpr(setValue);
  }
  @computed get message() {
    return this.store.execExpr(this.messageExpr) || this.labelText + this.store.t('输入无效');
  }
  set message(value) {
    if (this.setMessage) {
      return this.store.setViewModel(this.setMessage, value);
    }
    this.messageExpr = UIStore.parseExpr(value);
  }
  @computed get setMessage() {
    return this.store.execExpr(this.setMessageExpr);
  }
  set setMessage(setValue) {
    this.setMessageExpr = UIStore.parseExpr(setValue);
  }
  @computed get enum() {
    return this.store.execExpr(this.enumExpr);
  }
  set enum(value) {
    if (this.setEnum) {
      return this.store.setViewModel(this.setEnum, value);
    }
    this.enumExpr = UIStore.parseExpr(value);
  }
  @computed get setEnum() {
    return this.store.execExpr(this.setEnumExpr);
  }
  set setEnum(setValue) {
    this.setEnumExpr = UIStore.parseExpr(setValue);
  }
  @computed get len() {
    return this.store.execExpr(this.lenExpr);
  }
  set len(value) {
    if (this.setLen) {
      return this.store.setViewModel(this.setLen, value);
    }
    this.lenExpr = UIStore.parseExpr(value);
  }
  @computed get setLen() {
    return this.store.execExpr(this.setLenExpr);
  }
  set setLen(setValue) {
    this.setLenExpr = UIStore.parseExpr(setValue);
  }
  @computed get pattern() {
    return this.store.execExpr(this.patternExpr);
  }
  set pattern(value) {
    if (this.setPattern) {
      return this.store.setViewModel(this.setPattern, value);
    }
    this.patternExpr = UIStore.parseExpr(value);
  }
  @computed get setPattern() {
    return this.store.execExpr(this.setPatternExpr);
  }
  set setPattern(setValue) {
    this.setPatternExpr = UIStore.parseExpr(setValue);
  }
  @computed get whitespace() {
    return this.store.execExpr(this.whitespaceExpr);
  }
  set whitespace(value) {
    if (this.setWhitespace) {
      return this.store.setViewModel(this.setWhitespace, value);
    }
    this.whitespaceExpr = UIStore.parseExpr(value);
  }
  @computed get setWhitespace() {
    return this.store.execExpr(this.setWhitespaceExpr);
  }
  set setWhitespace(setValue) {
    this.setWhitespaceExpr = UIStore.parseExpr(setValue);
  }
  @computed get min() {
    return this.store.execExpr(this.minExpr);
  }
  set min(value) {
    if (this.setMin) {
      return this.store.setViewModel(this.setMin, value);
    }
    this.minExpr = UIStore.parseExpr(value);
  }
  @computed get setMin() {
    return this.store.execExpr(this.setMinExpr);
  }
  set setMin(setValue) {
    this.setMinExpr = UIStore.parseExpr(setValue);
  }
  @computed get max() {
    return this.store.execExpr(this.maxExpr);
  }
  set max(value) {
    if (this.setMax) {
      return this.store.setViewModel(this.setMax, value);
    }
    this.maxExpr = UIStore.parseExpr(value);
  }
  @computed get setMax() {
    return this.store.execExpr(this.setMaxExpr);
  }
  set setMax(setValue) {
    this.setMaxExpr = UIStore.parseExpr(setValue);
  }

  @computed get disable() {
    return this.store.execExpr(this.disableExpr);
  }
  set disable(value) {
    if (this.setDisable) {
      return this.store.setViewModel(this.setDisable, value);
    }
    this.disableExpr = UIStore.parseExpr(value);
  }
  @computed get setDisable() {
    return this.store.execExpr(this.setDisableExpr);
  }
  set setDisable(setValue) {
    this.setDisableExpr = UIStore.parseExpr(setValue);
  }

  constructor(store, name, typeExpr, setTypeExpr, messageExpr, setMessageExpr, requiredExpr, setRequiredExpr, enumExpr, setEnumExpr, lenExpr, setLenExpr, patternExpr, setPatternExpr, whitespaceExpr, setWhitespaceExpr, minExpr, setMinExpr, maxExpr, setMaxExpr, disableExpr, setDisableExpr) {
    this.key = assignId('Rule');
    this.store = store;
    this.name = name || this.key;

    this.typeExpr = typeExpr;
    this.setTypeExpr = setTypeExpr;
    this.requiredExpr = requiredExpr;
    this.setRequiredExpr = setRequiredExpr;
    this.messageExpr = messageExpr;
    this.setMessageExpr = setMessageExpr;
    this.enumExpr = enumExpr;
    this.setEnumExpr = setEnumExpr;
    this.lenExpr = lenExpr;
    this.setLenExpr = setLenExpr;
    this.patternExpr = patternExpr;
    this.setPatternExpr = setPatternExpr;
    this.whitespaceExpr = whitespaceExpr;
    this.setWhitespaceExpr = setWhitespaceExpr;
    this.minExpr = minExpr;
    this.setMinExpr = setMinExpr;
    this.maxExpr = maxExpr;
    this.setMaxExpr = setMaxExpr;
    this.disableExpr = disableExpr;
    this.setDisableExpr = setDisableExpr;
  }

  static createSchema(config) {
    console.log('parse %s rule...', config.name || config.type)
    return new UISchema(Rule,
      config.name,
      UIStore.parseExpr(config.type), UIStore.parseExpr(config.setType),
      UIStore.parseExpr(config.message), UIStore.parseExpr(config.setMessage),
      UIStore.parseExpr(config.required), UIStore.parseExpr(config.setRequired),
      UIStore.parseExpr(config.enum), UIStore.parseExpr(config.setEnum),
      UIStore.parseExpr(config.len), UIStore.parseExpr(config.setLen),
      UIStore.parseExpr(config.pattern), UIStore.parseExpr(config.setPattern),
      UIStore.parseExpr(config.whitespace), UIStore.parseExpr(config.setWhitespace),
      UIStore.parseExpr(config.min), UIStore.parseExpr(config.setMin),
      UIStore.parseExpr(config.max), UIStore.parseExpr(config.setMax)
    )
  }

}

export class FormItem {
  store;
  key;
  name;

  @observable labelSpanExpr;
  @observable setLabelSpanExpr;
  @observable labelTextExpr;
  @observable setLabelTextExpr;
  @observable labelIconExpr;
  @observable setLabelIconExpr;
  @observable tipTextExpr;
  @observable setTipTextExpr;
  @observable inputItem;
  @observable extraExpr;
  @observable setExtraExpr;
  // 描述信息和extra信息是不一样的，长文本
  @observable descriptionExpr;
  @observable setDescriptionExpr;

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
    return !!(this.inputItem && this.inputItem.visible);
  }
  set visible(value) {
    if (this.setVisible) {
      return this.store.setViewModel(this.setVisible, value);
    }
    this.visibleExpr = UIStore.parseExpr(value);
  }
  @computed get setVisible() {
    return this.store.execExpr(this.setVisibleExpr);
  }
  set setVisible(setValue) {
    this.setVisibleExpr = UIStore.parseExpr(setValue);
  }
  @computed get disable() {
    return this.inputItem.disable;
  }
  set disable(value) {
    if (this.setDisable) {
      return this.store.setViewModel(this.setDisable, value);
    }
    this.disableExpr = UIStore.parseExpr(value);
  }
  @computed get setDisable() {
    return this.store.execExpr(this.setDisableExpr);
  }
  set setDisable(setValue) {
    this.setDisableExpr = UIStore.parseExpr(setValue);
  }
  @computed get extra() {
    return this.store.execExpr(this.extraExpr);
  }
  set extra(value) {
    if (this.setExtra) {
      return this.store.setViewModel(this.setExtra, value);
    }
    this.extraExpr = UIStore.parseExpr(value);
  }
  @computed get setExtra() {
    return this.store.execExpr(this.setExtraExpr);
  }
  set setExtra(setValue) {
    this.setExtraExpr = UIStore.parseExpr(setValue);
  }
  @computed get description() {
    return this.store.execExpr(this.descriptionExpr);
  }
  set description(value) {
    if (this.setDescription) {
      return this.store.setViewModel(this.setDescription, value);
    }
    this.descriptionExpr = UIStore.parseExpr(value);
  }
  @computed get setDescription() {
    return this.store.execExpr(this.setDescriptionExpr);
  }
  set setDescription(setValue) {
    this.setDescriptionExpr = UIStore.parseExpr(setValue);
  }

  @computed get labelSpan() {
    const span = parseInt(this.store.execExpr(this.labelSpanExpr));
    return span !== 0 ? ((span || 4) % 24) : span;
  }
  set labelSpan(value) {
    if (this.setLabelSpan) {
      return this.store.setViewModel(this.setLabelSpan, value);
    }
    this.labelSpanExpr = UIStore.parseExpr(value);
  }
  @computed get setLabelSpan() {
    return this.store.execExpr(this.setLabelSpanExpr);
  }
  set setLabelSpan(setValue) {
    this.setLabelSpanExpr = UIStore.parseExpr(setValue);
  }
  @computed get labelText() {
    return this.store.execExpr(this.labelTextExpr);
  }
  set labelText(value) {
    if (this.setLabelText) {
      return this.store.setViewModel(this.setLabelText, value);
    }
    this.labelTextExpr = UIStore.parseExpr(value);
  }
  @computed get setLabelText() {
    return this.store.execExpr(this.setLabelTextExpr);
  }
  set setLabelText(setValue) {
    this.setLabelTextExpr = UIStore.parseExpr(setValue);
  }
  @computed get labelIcon() {
    return this.store.execExpr(this.labelIconExpr);
  }
  set labelIcon(value) {
    if (this.setLabelIcon) {
      return this.store.setViewModel(this.setLabelIcon, value);
    }
    this.labelIconExpr = UIStore.parseExpr(value);
  }
  @computed get setLabelIcon() {
    return this.store.execExpr(this.setLabelIconExpr);
  }
  set setLabelIcon(setValue) {
    this.setLabelIconExpr = UIStore.parseExpr(setValue);
  }
  @computed get tipText() {
    return this.store.execExpr(this.tipTextExpr);
  }
  set tipText(value) {
    if (this.setTipText) {
      return this.store.setViewModel(this.setTipText, value);
    }
    this.tipTextExpr = UIStore.parseExpr(value);
  }
  @computed get setTipText() {
    return this.store.execExpr(this.setTipTextExpr);
  }
  set setTipText(setValue) {
    this.setTipTextExpr = UIStore.parseExpr(setValue);
  }

  constructor(store, name, labelSpanExpr, setLabelSpanExpr, labelTextExpr,
    setLabelTextExpr, labelIconExpr, setLabelIconExpr, tipTextExpr, setTipTextExpr,
    extraExpr, setExtraExpr, descriptionExpr, setDescriptionExpr, inputItem, rules, btns) {
    this.key = assignId('FormItem');
    this.store = store;
    this.name = name || this.key;

    this.labelSpanExpr = labelSpanExpr;
    this.setLabelSpanExpr = setLabelSpanExpr;
    this.labelTextExpr = labelTextExpr;
    this.setLabelTextExpr = setLabelTextExpr;
    this.labelIconExpr = labelIconExpr;
    this.setLabelIconExpr = setLabelIconExpr;
    this.tipTextExpr = tipTextExpr;
    this.setTipTextExpr = setTipTextExpr;

    this.extraExpr = extraExpr;
    this.setExtraExpr = setExtraExpr;
    this.descriptionExpr = descriptionExpr;
    this.setDescriptionExpr = setDescriptionExpr;

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

  static createSchema(config) {
    console.log('parse %s form item...', config.name || config.type)
    return new UISchema(FormItem,
      config.name,
      UIStore.parseExpr(config.labelSpan  ), UIStore.parseExpr(config.setLabelSpan),
      UIStore.parseExpr(config.labelText ), UIStore.parseExpr(config.setLabelText),
      UIStore.parseExpr(config.labelIcon ), UIStore.parseExpr(config.setLabelIcon),
      UIStore.parseExpr(config.tipText ), UIStore.parseExpr(config.setTipText),
      UIStore.parseExpr(config.extra), UIStore.parseExpr(config.setExtra),
      UIStore.parseExpr(config.description ), UIStore.parseExpr(config.setDescription),
      UIStore.createSchema(config.input),
      // 默认有一条规则config中尝试查找
      config.rules.map(it => Rule.createSchema(it)),
      config.btns.map(it => Button.createSchema(it))
    )
  }
}

// 表单模型
export class Form {
  store;
  key;

  name;
  @observable typeExpr;
  @observable setTypeExpr;

  @observable disableExpr;
  @observable setDisableExpr;
  @observable visibleExpr;
  @observable setVisibleExpr;

  // from的下一级可以是container，支持将formitem划分多个区域展示
  @observable allitems;

  @computed get type() {
    return this.store.execExpr(this.typeExpr);
  }
  set type(value) {
    if (this.setType) {
      return this.store.setViewModel(this.setType, value);
    }
    this.typeExpr = UIStore.parseExpr(value);
  }
  @computed get setType() {
    return this.store.execExpr(this.setTypeExpr);
  }
  set setType(setValue) {
    this.setTypeExpr = UIStore.parseExpr(setValue);
  }

  @computed get items() {
    return this.allitems.filter(it => it.visible);
  }

  @computed get disable() {
    return this.store.execExpr(this.disableExpr);
  }
  set disable(value) {
    if (this.setDisable) {
      return this.store.setViewModel(this.setDisable, value);
    }
    this.disableExpr = UIStore.parseExpr(value);
  }
  @computed get setDisable() {
    return this.store.execExpr(this.setDisableExpr);
  }
  set setDisable(setValue) {
    this.setDisableExpr = UIStore.parseExpr(setValue);
  }
  @computed get visible() {
    return this.store.execExpr(this.visibleExpr);
  }
  set visible(value) {
    if (this.setVisible) {
      return this.store.setViewModel(this.setVisible, value);
    }
    this.visibleExpr = UIStore.parseExpr(value);
  }
  @computed get setVisible() {
    return this.store.execExpr(this.setVisibleExpr);
  }
  set setVisible(setValue) {
    this.setVisibleExpr = UIStore.parseExpr(setValue);
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

  constructor(store, name, typeExpr, setTypeExpr, disableExpr, setDisableExpr, visibleExpr, setVisibleExpr,
    items = [],
    onBeforeChange, onChange, onAfterChange,
    onBeforeLoad, onLoad, onAfterLoad,
    onBeforeValidate, onValidate, onAfterValidate,
    onBeforeSave, onSave, onAfterSave) {
    //assert(store);

    this.key = assignId('Form');
    this.store = store;
    this.name = name || this.key;
    this.allitems = items;
    this.typeExpr = typeExpr;
    this.setTypeExpr = setTypeExpr;
    this.disableExpr = disableExpr;
    this.setDisableExpr = setDisableExpr;
    this.visibleExpr = visibleExpr;
    this.setVisibleExpr = setVisibleExpr;

    this.onBeforeChange = onBeforeChange;
    this.onChange = onChange;
    this.onAfterChange = onAfterChange;

    this.onBeforeLoad = onBeforeLoad;
    this.onLoad = onLoad;
    this.onAfterLoad = onAfterLoad;

    this.onBeforeValidate = onBeforeValidate;
    this.onValidate = onValidate;
    this.onAfterValidate = onAfterValidate;

    this.onBeforeSave = onBeforeSave;
    this.onSave = onSave;
    this.onAfterSave = onAfterSave;
  }

  @action addItem(...items) {
    this.allitems.push(...items);
  }

  @action removeItem(...names) {
    for (const name of names) {
      const reit = this.allitems.find(it => it.name === name);
      if (reit) {
        this.allitems.splice(this.allitems.indexOf(reit), 1);
      } else {
        console.warn('form container not exists!', name);
      }
    }
  }

  @action clearItems() {
    this.allitems.clear();
  }

  static createSchema(config = []) {
    console.log('parse %s form...', config.name || config.type)
    return new UISchema(Form,
      config.name  ,
      UIStore.parseExpr(config.type), UIStore.parseExpr(config.setType),
      UIStore.parseExpr(config.disable || false), UIStore.parseExpr(config.setDisable),
      UIStore.parseExpr(config.visible || true), UIStore.parseExpr(config.setDisable),
      config.items.map(it => Container.createSchema(it )),
      Action.createSchema(config.onChanging), Action.createSchema(config.onChange), Action.createSchema(config.onChanged),
      Action.createSchema(config.onLoading), Action.createSchema(config.onLoad), Action.createSchema(config.onLoaded),
      Action.createSchema(config.onValidating), Action.createSchema(config.onValidate), Action.createSchema(config.onValidatied),
      Action.createSchema(config.onSaveing), Action.createSchema(config.onSave), Action.createSchema(config.onSaveed)
    )
  }
}
