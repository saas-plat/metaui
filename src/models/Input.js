import {
  observable,
  computed,
  action,
  isObservableObject
} from "mobx";
import {
  assignId,
  queryData
} from './util';
import {
  Action
} from './Action';
import {
  EditTable
} from './EditTable';
import moment from 'moment';
import _get from 'lodash/get';
import _set from 'lodash/set';

export class Input {
  store;
  key;

  name;
  @observable typeExpr;
  @observable textExpr;
  @observable placeholderExpr;
  @observable clearExpr;
  @observable visibleExpr;
  @observable disableExpr;
  @observable maxLengthExpr;
  @observable sizeExpr;
  @observable widthExpr;
  @observable defaultValueExpr;
  @observable formatExpr;
  @observable errorExpr;
  @observable extraExpr;

  // 取值表达式
  @observable getValueExpr;
  // 赋值映射
  @observable mappingExpr;
  // 指定赋值表达式
  @observable setValueExpr;

  @observable onBeforeChange;
  @observable onChange;
  @observable onAfterChange;
  @observable onBeforeBlur;
  @observable onBlur;
  @observable onAfterBlur;
  @observable onBeforeFocus;
  @observable onFocus;
  @observable onAfterFocus;
  @observable onBeforeErrorClick;
  @observable onErrorClick;
  @observable onAfterErrorClick;
  @observable onBeforeExtraClick;
  @observable onExtraClick;
  @observable onAfterExtraClick;


  @computed get type() {
    return this.store.execExpr(this.typeExpr);
  }
  set type(typeExpr) {
    this.typeExpr = this.store.parseExpr(typeExpr);
  }
  @computed get text() {
    return this.store.execExpr(this.textExpr);
  }
  set text(textExpr) {
    this.textExpr = this.store.parseExpr(textExpr);
  }
  @computed get placeholder() {
    return this.store.execExpr(this.placeholderExpr);
  }
  set placeholder(placeholderExpr) {
    this.placeholderExpr = this.store.parseExpr(placeholderExpr);
  }
  @computed get clear() {
    return this.store.execExpr(this.clearExpr);
  }
  set clear(clearExpr) {
    this.clearExpr = this.store.parseExpr(clearExpr);
  }

  @computed get visible() {
    return this.store.execExpr(this.visibleExpr);
  }
  set visible(visibleExpr) {
    this.visibleExpr = this.store.parseExpr(visibleExpr);
  }
  @computed get disable() {
    return this.store.execExpr(this.disableExpr);
  }
  set disable(disableExpr) {
    this.disableExpr = this.store.parseExpr(disableExpr);
  }
  @computed get size() {
    return this.store.execExpr(this.sizeExpr);
  }
  set size(sizeExpr) {
    this.sizeExpr = this.store.parseExpr(sizeExpr);
  }
  @computed get maxLength() {
    return this.store.execExpr(this.maxLengthExpr);
  }
  set maxLength(maxLengthExpr) {
    this.maxLengthExpr = this.store.parseExpr(maxLengthExpr);
  }
  @computed get width() {
    return this.store.execExpr(this.widthExpr);
  }
  set width(widthExpr) {
    this.widthExpr = this.store.parseExpr(widthExpr);
  }

  @computed get defaultValue() {
    return this.store.execExpr(this.defaultValueExpr);
  }
  set defaultValue(defaultValueExpr) {
    this.defaultValueExpr = this.store.parseExpr(defaultValueExpr);
  }
  @computed get getValue() {
    return this.store.execExpr(this.getValueExpr);
  }
  set getValue(getValueExpr) {
    this.getValueExpr = this.store.parseExpr(getValueExpr);
  }
  @computed get value() {
    return _get(this.store.model, this.getValue);
  }
  set value(value) {
    if (!this.setValue) {
      console.warn('can not set value', value);
    }
    return _set(this.store.model, this.setValue, value);
  }
  @computed get setValue() {
    return this.store.execExpr(this.setValueExpr);
  }
  set setValue(setValueExpr) {
    this.setValueExpr = this.store.parseExpr(setValueExpr);
  }
  @computed get mapping() {
    return this.store.execExpr(this.mappingExpr);
  }
  set mapping(mappingExpr) {
    this.mappingExpr = this.store.parseExpr(mappingExpr);
  }
  @computed get format() {
    return this.store.execExpr(this.formatExpr);
  }
  set format(formatExpr) {
    this.formatExpr = this.store.parseExpr(formatExpr);
  }
  @computed get error() {
    return this.store.execExpr(this.errorExpr);
  }
  set error(errorExpr) {
    this.errorExpr = this.store.parseExpr(errorExpr);
  }
  @computed get extra() {
    return this.store.execExpr(this.extraExpr);
  }
  set extra(extraExpr) {
    this.extraExpr = this.store.parseExpr(extraExpr);
  }

  @computed get max() {
    return this.store.execExpr(this.maxExpr);
  }
  set max(maxExpr) {
    this.maxExpr = this.store.parseExpr(maxExpr);
  }

  toString() {
    return this.type + ':' + this.name;
  }

  constructor(store, name, typeExpr = 'text', textExpr, placeholderExpr, clearExpr = false, visibleExpr = true, disableExpr = false, sizeExpr = 'default',
    maxLengthExpr, widthExpr, defaultValueExpr, getValueExpr, setValueExpr, mappingExpr, formatExpr = '', errorExpr = true, extraExpr,
    onBeforeChange, onChange, onAfterChange, onBeforeBlur, onBlur, onAfterBlur, onBeforeFocus, onFocus, onAfterFocus, onBeforeErrorClick,
    onErrorClick, onAfterErrorClick, onBeforeExtraClick, onExtraClick, onAfterExtraClick) {

    this.key = assignId('Input');
    this.store = store;
    this.name = name || this.key;

    this.typeExpr = store.parseExpr(typeExpr);
    this.textExpr = store.parseExpr(textExpr);
    this.placeholderExpr = store.parseExpr(placeholderExpr);
    this.clearExpr = store.parseExpr(clearExpr);
    this.disableExpr = store.parseExpr(disableExpr);
    this.visibleExpr = store.parseExpr(visibleExpr);
    this.sizeExpr = store.parseExpr(sizeExpr);
    this.maxLengthExpr = store.parseExpr(maxLengthExpr);
    this.widthExpr = store.parseExpr(widthExpr);
    this.defaultValueExpr = store.parseExpr(defaultValueExpr);
    this.getValueExpr = store.parseExpr(getValueExpr);
    this.setValueExpr = store.parseExpr(setValueExpr);
    this.mappingExpr = store.parseExpr(mappingExpr);
    this.formatExpr = store.parseExpr(formatExpr);
    this.errorExpr = store.parseExpr(errorExpr);
    this.extraExpr = store.parseExpr(extraExpr);

    this.onBeforeChange = onBeforeChange;
    // 默认赋值功能
    this.onChange = onChange; //  || Action.createSchema( 'setValue')
    this.onAfterChange = onAfterChange;
    this.onBeforeBlur = onBeforeBlur;
    this.onBlur = onBlur;
    this.onAfterBlur = onAfterBlur;
    this.onBeforeFocus = onBeforeFocus;
    this.onFocus = onFocus;
    this.onAfterFocus = onAfterFocus;
    this.onBeforeErrorClick = onBeforeErrorClick;
    this.onErrorClick = onErrorClick;
    this.onAfterErrorClick = onAfterErrorClick;
    this.onBeforeExtraClick = onBeforeExtraClick;
    this.onExtraClick = onExtraClick;
    this.onAfterExtraClick = onAfterExtraClick;
  }

  static createSchema(object) {
    console.log('create %s input...',object.name|| object.type)
    if (object.type === 'money' || object.type === 'decimal') {
      object.type = 'number';
      object.format = object.format || 'thousandth';
    }
    if (object.type === 'refselect') {
      return {
        type: RefInput,
        args: [object.name, object.type, object.text, object.placeholder, object.clear,
          object.visible, object.disable, object.size, object.maxLength, object.width, object.defaultValue, object.value, object.setValue || object.value, object.mapping,
          object.format, object.error, object.extra, Action.createSchema(object.onChanging),
          Action.createSchema(object.onChange), Action.createSchema(object.onChanged), Action.createSchema(object.onBluring),
          Action.createSchema(object.onBlur), Action.createSchema(object.onBlured), Action.createSchema(object.onFocusing),
          Action.createSchema(object.onFocus), Action.createSchema(object.onFocused), Action.createSchema(object.onErrorClicking),
          Action.createSchema(object.onErrorClick), Action.createSchema(object.onErrorClicked),
          Action.createSchema(object.onExtraClicking), Action.createSchema(object.onExtraClick),
          Action.createSchema(object.onExtraClicked),
          object.dropdownStyle,
          object.multiple,
          object.showSearch,
          object.query, object.variables,
          object.displayField,
          object.sortField,
          object.mapping,
          object.columns,
          object.setValue,
          object.pageSize,
          object.idField, object.pidField, object.rootIdValue, object.defaultExpandAll, object.defaultExpandKeys
        ]
      };
    } else if (object.type === 'inputtable' || object.type === 'table') {
      return {
        type: InputTable,
        args: [object.name, object.type, object.text, object.placeholder, object.clear,
          object.visible, object.disable, object.size, object.maxLength, object.width, object.defaultValue, object.value, object.setValue || object.value, object.mapping,
          object.format, object.error, object.extra, Action.createSchema(object.onChanging),
          Action.createSchema(object.onChange), Action.createSchema(object.onChanged), Action.createSchema(object.onBluring),
          Action.createSchema(object.onBlur), Action.createSchema(object.onBlured), Action.createSchema(object.onFocusing),
          Action.createSchema(object.onFocus), Action.createSchema(object.onFocused), Action.createSchema(object.onErrorClicking),
          Action.createSchema(object.onErrorClick), Action.createSchema(object.onErrorClicked),
          Action.createSchema(object.onExtraClicking), Action.createSchema(object.onExtraClick),
          Action.createSchema(object.onExtraClicked),
          EditTable.createSchema(object.table)
        ]
      };
    } else if (object.type === 'select') {
      return {
        type: Select,
        args: [object.name, object.type, object.text, object.placeholder, object.clear,
          object.visible, object.disable, object.size, object.maxLength, object.width, object.defaultValue, object.value, object.setValue || object.value, object.mapping,
          object.format, object.error, object.extra, Action.createSchema(object.onChanging),
          Action.createSchema(object.onChange), Action.createSchema(object.onChanged), Action.createSchema(object.onBluring),
          Action.createSchema(object.onBlur), Action.createSchema(object.onBlured), Action.createSchema(object.onFocusing),
          Action.createSchema(object.onFocus), Action.createSchema(object.onFocused), Action.createSchema(object.onErrorClicking),
          Action.createSchema(object.onErrorClick), Action.createSchema(object.onErrorClicked),
          Action.createSchema(object.onExtraClicking), Action.createSchema(object.onExtraClick),
          Action.createSchema(object.onExtraClicked),
          object.dataSource, object.mode,
          object.displayField, object.valueField, object.sortField
        ]
      };
    } else if (object.type === 'treeselect') {
      return {
        type: TreeSelect,
        args: [object.name, object.type, object.text, object.placeholder, object.clear,
          object.visible, object.disable, object.size, object.maxLength, object.width, object.defaultValue, object.value, object.setValue || object.value, object.mapping,
          object.format, object.error, object.extra, Action.createSchema(object.onChanging),
          Action.createSchema(object.onChange), Action.createSchema(object.onChanged), Action.createSchema(object.onBluring),
          Action.createSchema(object.onBlur), Action.createSchema(object.onBlured), Action.createSchema(object.onFocusing),
          Action.createSchema(object.onFocus), Action.createSchema(object.onFocused), Action.createSchema(object.onErrorClicking),
          Action.createSchema(object.onErrorClick), Action.createSchema(object.onErrorClicked),
          Action.createSchema(object.onExtraClicking), Action.createSchema(object.onExtraClick),
          Action.createSchema(object.onExtraClicked),
          object.dataSource, object.mode,
          object.displayField, object.valueField, object.sortField,
          object.showSearch, object.allowClear, object.treeDefaultExpandAll, object.maxHeight, object.treeCheckable,
          object.idField, object.pidField, object.rootIdValue
        ]
      };
    } else if (object.type === 'number') {
      return {
        type: NumberInput,
        args: [object.name, object.type, object.text, object.placeholder, object.clear,
          object.visible, object.disable, object.size, object.maxLength, object.width, object.defaultValue, object.value, object.setValue || object.value, object.mapping,
          object.format, object.error, object.extra, object.min, object.max, Action.createSchema(object.onChanging),
          Action.createSchema(object.onChange), Action.createSchema(object.onChanged), Action.createSchema(object.onBluring),
          Action.createSchema(object.onBlur), Action.createSchema(object.onBlured), Action.createSchema(object.onFocusing),
          Action.createSchema(object.onFocus), Action.createSchema(object.onFocused), Action.createSchema(object.onErrorClicking),
          Action.createSchema(object.onErrorClick), Action.createSchema(object.onErrorClicked),
          Action.createSchema(object.onExtraClicking), Action.createSchema(object.onExtraClick),
          Action.createSchema(object.onExtraClicked)
        ]
      };
    } else {
      if (!object.format) {
        switch (object.type) {
        case 'date':
        case 'daterange':
          object.format = "YYYY-MM-DD";
          break;
        case 'datetime':
          object.format = "YYYY-MM-DD HH:mm:ss";
          break;
        case 'time':
          object.format = "HH:mm:ss";
          break;
        case 'week':
          object.format = "YYYY-wo";
          break;
        case 'month':
          object.format = "YYYY-MM";
          break;
        }
      }
      return {
        type: Input,
        args: [object.name, object.type, object.text, object.placeholder, object.clear,
          object.visible, object.disable, object.size, object.maxLength, object.width, object.defaultValue, object.value, object.setValue || object.value, object.mapping,
          object.format, object.error, object.extra, Action.createSchema(object.onChanging),
          Action.createSchema(object.onChange), Action.createSchema(object.onChanged), Action.createSchema(object.onBluring),
          Action.createSchema(object.onBlur), Action.createSchema(object.onBlured), Action.createSchema(object.onFocusing),
          Action.createSchema(object.onFocus), Action.createSchema(object.onFocused), Action.createSchema(object.onErrorClicking),
          Action.createSchema(object.onErrorClick), Action.createSchema(object.onErrorClicked),
          Action.createSchema(object.onExtraClicking), Action.createSchema(object.onExtraClick),
          Action.createSchema(object.onExtraClicked)
        ]
      };
    }
  }
}

export class NumberInput extends Input {

  @observable minExpr;
  @observable maxExpr;

  @computed get min() {
    return this.store.execExpr(this.minExpr);
  }
  set min(minExpr) {
    this.minExpr = this.store.parseExpr(minExpr);
  }

  constructor(store, name, typeExpr = 'text', textExpr, placeholderExpr, clearExpr = false, visibleExpr = true, disableExpr = false, sizeExpr = 'default',
    maxLengthExpr, widthExpr, defaultValueExpr, getValueExpr, setValueExpr, mappingExpr, formatExpr = '', errorExpr = true, extraExpr, minExpr = -Infinity, maxExpr = Infinity,
    onBeforeChange, onChange, onAfterChange, onBeforeBlur, onBlur, onAfterBlur, onBeforeFocus, onFocus, onAfterFocus, onBeforeErrorClick,
    onErrorClick, onAfterErrorClick, onBeforeExtraClick, onExtraClick, onAfterExtraClick) {
    super(store, name, typeExpr, textExpr, placeholderExpr, clearExpr, visibleExpr, disableExpr, sizeExpr,
      maxLengthExpr, widthExpr, defaultValueExpr, getValueExpr, setValueExpr, mappingExpr, formatExpr, errorExpr, extraExpr,
      onBeforeChange, onChange, onAfterChange, onBeforeBlur, onBlur, onAfterBlur, onBeforeFocus, onFocus, onAfterFocus, onBeforeErrorClick,
      onErrorClick, onAfterErrorClick, onBeforeExtraClick, onExtraClick, onAfterExtraClick);

    this.minExpr = store.parseExpr(minExpr);
    this.maxExpr = store.parseExpr(maxExpr);
  }
}

export class Select extends Input {
  @observable modeExpr;
  @observable dataSourceExpr;
  @observable displayFieldExpr;
  @observable valueFieldExpr;
  @observable sortFieldExpr;

  @computed get mode() {
    return this.store.execExpr(this.modeExpr);
  }
  set mode(modeExpr) {
    this.modeExpr = this.store.parseExpr(modeExpr);
  }

  @computed get value() {
    const value = _get(this.store.model, this.getValue);
    if (isObservableObject(value)) {
      return value.slice();
    }
    return value;
  }

  @computed get displayField() {
    return this.store.execExpr(this.displayFieldExpr);
  }
  set displayField(displayFieldExpr) {
    this.displayFieldExpr = this.store.parseExpr(displayFieldExpr);
  }
  @computed get valueField() {
    return this.store.execExpr(this.valueFieldExpr);
  }
  set valueField(valueFieldExpr) {
    this.valueFieldExpr = this.store.parseExpr(valueFieldExpr);
  }
  @computed get sortField() {
    return this.store.execExpr(this.sortFieldExpr);
  }
  set sortField(sortFieldExpr) {
    this.sortFieldExpr = this.store.parseExpr(sortFieldExpr);
  }

  @computed get dataSource() {
    let data = (this.store.execExpr(this.dataSourceExpr) || []);
    if (isObservableObject(data)) {
      data = data.slice();
    }
    return data.map(it => {

      // 基本数据类型转成{text,value}
      if (isPrimaryType(it)) {
        let text;
        if (this.format && it instanceof Date) {
          text = moment(it).toString(this.format);
        } else {
          text = it.toString();
        }
        return {
          text,
          value: it
        }
      } else {
        let text;
        if (this.format && it[this.displayField] instanceof Date) {
          text = moment(it[this.displayField]).toString(this.format);
        } else {
          text = it.toString();
        }
        return {
          text,
          value: it[this.valueField]
        };
      }

    });
  }

  constructor(store, name, typeExpr = 'text', textExpr, placeholderExpr, clearExpr = false, visibleExpr = true, disableExpr = false, sizeExpr = 'default',
    maxLengthExpr, widthExpr, defaultValueExpr, getValueExpr, setValueExpr, mappingExpr, formatExpr = '', errorExpr = true, extraExpr,
    onBeforeChange, onChange, onAfterChange, onBeforeBlur, onBlur, onAfterBlur, onBeforeFocus, onFocus, onAfterFocus, onBeforeErrorClick,
    onErrorClick, onAfterErrorClick, onBeforeExtraClick, onExtraClick, onAfterExtraClick,
    dataSourceExpr, modeExpr, dataMappingExpr, displayFieldExpr, valueFieldExpr, sortFieldExpr) {
    super(store, name, typeExpr, textExpr, placeholderExpr, clearExpr, visibleExpr, disableExpr, sizeExpr,
      maxLengthExpr, widthExpr, defaultValueExpr, getValueExpr, setValueExpr, mappingExpr, formatExpr, errorExpr, extraExpr,
      onBeforeChange, onChange, onAfterChange, onBeforeBlur, onBlur, onAfterBlur, onBeforeFocus, onFocus, onAfterFocus, onBeforeErrorClick,
      onErrorClick, onAfterErrorClick, onBeforeExtraClick, onExtraClick, onAfterExtraClick);

    this.dataSourceExpr = store.parseExpr(dataSourceExpr || []);
    this.modeExpr = store.parseExpr(modeExpr);
    this.dataMappingExpr = store.parseExpr(dataMappingExpr);

    this.displayFieldExpr = store.parseExpr(displayFieldExpr || 'id');
    this.valueFieldExpr = store.parseExpr(valueFieldExpr || 'id');
    this.sortFieldExpr = store.parseExpr(sortFieldExpr);
  }
}

const isPrimaryType = (it) => {
  return typeof it === 'string' || typeof it === 'number' || typeof it === 'boolean' || it instanceof Date;
}

const getTree = (data = [], pid, {
  displayField,
  valueField,
  idField,
  pidField,
  sortField,
  format
}) => {
  return data.filter(it => {
    if (isPrimaryType(it)) {
      return it === pid;
    }
    return it[pidField] === pid;
  }).sort((a, b) => {
    if (isPrimaryType(a)) {
      return a - b;
    }
    return a[sortField] - b[sortField];
  }).map(it => {
    let key, title, value, id;
    if (isPrimaryType(it)) {
      id = it;
      key = data.indexOf(it);
      if (format && it instanceof Date) {
        title = moment(it).toString(format);
      } else {
        title = it.toString();
      }
      value = it;
    } else {
      key = id = it[idField];
      if (format && it[displayField] instanceof Date) {
        title = moment(it[displayField]).toString(format);
      } else {
        title = it[displayField].toString();
      }
      value = it[valueField];
    }
    return {
      key,
      value,
      title,
      children: getTree(data, id, {
        displayField,
        valueField,
        idField,
        pidField,
        sortField,
        format
      })
    }
  });
}

const getTreeTable = (data = [], pid, {
  idField,
  pidField,
  sortField
}) => {
  return data.filter(it => {
    return it[pidField] === pid;
  }).sort((a, b) => {
    if (isPrimaryType(a)) {
      return a - b;
    }
    return a[sortField] - b[sortField];
  }).map(it => {
    let key, id;
    key = id = it[idField];
    return {
      key,
      ...it,
      children: getTree(data, id, {
        idField,
        pidField,
        sortField
      })
    }
  });
}

export class TreeSelect extends Select {

  @observable idFieldExpr;
  @observable pidFieldExpr;

  @observable showSearchExpr;
  @observable allowClearExpr;
  @observable treeDefaultExpandAllExpr;
  @observable maxHeightExpr;
  @observable treeCheckableExpr;
  @observable rootIdValueExpr;

  @computed get multiple() {
    return this.mode === 'multiple';
  }
  set multiple(multipleExpr) {
    this.mode(this.store.execExpr(this.multipleExpr) ? 'multiple' : null);
  }

  @computed get showSearch() {
    return this.store.execExpr(this.showSearchExpr);
  }
  set showSearch(showSearchExpr) {
    this.showSearchExpr = this.store.parseExpr(showSearchExpr);
  }
  @computed get allowClear() {
    return this.store.execExpr(this.allowClearExpr);
  }
  set allowClear(allowClearExpr) {
    this.allowClearExpr = this.store.parseExpr(allowClearExpr);
  }
  @computed get treeDefaultExpandAll() {
    return this.store.execExpr(this.treeDefaultExpandAllExpr);
  }
  set treeDefaultExpandAll(treeDefaultExpandAllExpr) {
    this.treeDefaultExpandAllExpr = this.store.parseExpr(treeDefaultExpandAllExpr);
  }
  @computed get maxHeight() {
    return this.store.execExpr(this.maxHeightExpr);
  }
  set maxHeight(maxHeightExpr) {
    this.maxHeightExpr = this.store.parseExpr(maxHeightExpr);
  }
  @computed get treeCheckable() {
    return this.store.execExpr(this.treeCheckableExpr);
  }
  set treeCheckable(treeCheckableExpr) {
    this.treeCheckableExpr = this.store.parseExpr(treeCheckableExpr);
  }

  @computed get idField() {
    return this.store.execExpr(this.idFieldExpr);
  }
  set idField(idFieldExpr) {
    this.idFieldExpr = this.store.parseExpr(idFieldExpr);
  }
  @computed get pidField() {
    return this.store.execExpr(this.pidFieldExpr);
  }
  set pidField(pidFieldExpr) {
    this.pidFieldExpr = this.store.parseExpr(pidFieldExpr);
  }
  @computed get rootIdValue() {
    return this.store.execExpr(this.rootIdValueExpr);
  }
  set rootIdValue(rootIdValueExpr) {
    this.rootIdValueExpr = this.store.parseExpr(rootIdValueExpr);
  }

  @computed get dataSource() {
    let data = (this.store.execExpr(this.dataSourceExpr) || []);
    if (isObservableObject(data)) {
      data = data.slice();
    }
    // 转成tree结构
    return getTree(data, this.rootIdValue, {
      displayField: this.displayField,
      valueField: this.valueField,
      idField: this.idField,
      pidField: this.pidField,
      sortField: this.sortField,
      format: this.format,
    });
  }

  constructor(store, name, typeExpr = 'text', textExpr, placeholderExpr, clearExpr = false, visibleExpr = true, disableExpr = false, sizeExpr = 'default',
    maxLengthExpr, widthExpr, defaultValueExpr, getValueExpr, setValueExpr, mappingExpr, formatExpr = '', errorExpr = true, extraExpr,
    onBeforeChange, onChange, onAfterChange, onBeforeBlur, onBlur, onAfterBlur, onBeforeFocus, onFocus, onAfterFocus, onBeforeErrorClick,
    onErrorClick, onAfterErrorClick, onBeforeExtraClick, onExtraClick, onAfterExtraClick,
    dataSourceExpr, modeExpr,
    displayFieldExpr, valueFieldExpr, sortFieldExpr,
    showSearchExpr, allowClearExpr, treeDefaultExpandAllExpr, maxHeightExpr, treeCheckableExpr,
    idFieldExpr, pidFieldExpr, rootIdValueExpr) {
    super(store, name, typeExpr, textExpr, placeholderExpr, clearExpr, visibleExpr, disableExpr, sizeExpr,
      maxLengthExpr, widthExpr, defaultValueExpr, getValueExpr, setValueExpr, mappingExpr, formatExpr, errorExpr, extraExpr,
      onBeforeChange, onChange, onAfterChange, onBeforeBlur, onBlur, onAfterBlur, onBeforeFocus, onFocus, onAfterFocus, onBeforeErrorClick,
      onErrorClick, onAfterErrorClick, onBeforeExtraClick, onExtraClick, onAfterExtraClick,
      dataSourceExpr, modeExpr,
      displayFieldExpr, valueFieldExpr, sortFieldExpr);

    this.showSearchExpr = store.parseExpr(showSearchExpr || false);
    this.allowClearExpr = store.parseExpr(allowClearExpr || true);
    this.treeDefaultExpandAllExpr = store.parseExpr(treeDefaultExpandAllExpr || true);
    this.maxHeightExpr = store.parseExpr(maxHeightExpr || 400);
    this.treeCheckableExpr = store.parseExpr(treeCheckableExpr || false);

    this.idFieldExpr = store.parseExpr(idFieldExpr || 'id');
    this.pidFieldExpr = store.parseExpr(pidFieldExpr || 'pid');
    this.rootIdValueExpr = store.parseExpr(rootIdValueExpr);
  }
}

export class InputTable extends Input {
  @observable table;

  constructor(store, name, typeExpr = 'text', textExpr, placeholderExpr, clearExpr = false, visibleExpr = true, disableExpr = false, sizeExpr = 'default',
    maxLengthExpr, widthExpr, defaultValueExpr, getValueExpr, setValueExpr, mappingExpr, formatExpr = '', errorExpr = true, extraExpr,
    onBeforeChange, onChange, onAfterChange, onBeforeBlur, onBlur, onAfterBlur, onBeforeFocus, onFocus, onAfterFocus, onBeforeErrorClick,
    onErrorClick, onAfterErrorClick, onBeforeExtraClick, onExtraClick, onAfterExtraClick,
    table) {
    super(store, name, typeExpr, textExpr, placeholderExpr, clearExpr, visibleExpr, disableExpr, sizeExpr,
      maxLengthExpr, widthExpr, defaultValueExpr, getValueExpr, setValueExpr, mappingExpr, formatExpr, errorExpr, extraExpr,
      onBeforeChange, onChange, onAfterChange, onBeforeBlur, onBlur, onAfterBlur, onBeforeFocus, onFocus, onAfterFocus, onBeforeErrorClick,
      onErrorClick, onAfterErrorClick, onBeforeExtraClick, onExtraClick, onAfterExtraClick);

    this.table = table;
  }
}

export class RefInput extends Input {
  @observable dropdownStyleExpr;
  @observable multipleExpr;
  @observable showSearchExpr;
  @observable queryExpr;
  @observable variablesExpr;
  @observable displayFieldExpr;
  @observable sortFieldExpr;
  @observable showHeaderExpr;
  @observable pageSizeExpr;

  @observable idFieldExpr;
  @observable pidFieldExpr;
  @observable rootIdValueExpr;
  @observable defaultExpandAllExpr;
  @observable defaultExpandKeysExpr;

  set dropdownStyle(dropdownStyleExpr) {
    this.dropdownStyleExpr = this.store.parseExpr(dropdownStyleExpr);
    this.showHeader = this.dropdownStyle === 'table';
  }
  @computed get dropdownStyle() {
    return this.store.execExpr(this.dropdownStyleExpr);
  }
  set multiple(multipleExpr) {
    this.multipleExpr = this.store.parseExpr(multipleExpr);
  }
  @computed get multiple() {
    return !!this.store.execExpr(this.multipleExpr);
  }
  set showSearch(showSearchExpr) {
    this.showSearchExpr = this.store.parseExpr(showSearchExpr);
  }
  @computed get showSearch() {
    return !!this.store.execExpr(this.showSearchExpr);
  }
  set query(queryExpr) {
    this.queryExpr = this.store.parseExpr(queryExpr);
  }
  @computed get query() {
    return this.store.execExpr(this.queryExpr);
  }
  set variables(variablesExpr) {
    this.variablesExpr = this.store.parseExpr(variablesExpr);
  }
  @computed get variables() {
    return this.store.execExpr(this.variablesExpr);
  }
  set displayField(displayFieldExpr) {
    this.displayFieldExpr = this.store.parseExpr(displayFieldExpr);
  }
  @computed get displayField() {
    return this.store.execExpr(this.displayFieldExpr);
  }
  set sortField(sortFieldExpr) {
    this.sortFieldExpr = this.store.parseExpr(sortFieldExpr);
  }
  @computed get sortField() {
    return this.store.execExpr(this.sortFieldExpr);
  }
  set showHeader(showHeaderExpr) {
    this.showHeaderExpr = this.store.parseExpr(showHeaderExpr);
  }
  @computed get showHeader() {
    return !!this.store.execExpr(this.showHeaderExpr);
  }
  set pageSize(pageSizeExpr) {
    this.pageSizeExpr = this.store.parseExpr(pageSizeExpr);
  }
  @computed get pageSize() {
    return parseInt(this.store.execExpr(this.pageSizeExpr)) || 20;
  }

  @computed get idField() {
    return this.store.execExpr(this.idFieldExpr);
  }
  set idField(idFieldExpr) {
    this.idFieldExpr = this.store.parseExpr(idFieldExpr);
  }
  @computed get pidField() {
    return this.store.execExpr(this.pidFieldExpr);
  }
  set pidField(pidFieldExpr) {
    this.pidFieldExpr = this.store.parseExpr(pidFieldExpr);
  }
  @computed get rootIdValue() {
    return this.store.execExpr(this.rootIdValueExpr);
  }
  set rootIdValue(rootIdValueExpr) {
    this.rootIdValueExpr = this.store.parseExpr(rootIdValueExpr);
  }
  @computed get defaultExpandAll() {
    return !!this.store.execExpr(this.defaultExpandAllExpr);
  }
  set defaultExpandAll(defaultExpandAllExpr) {
    this.defaultExpandAllExpr = this.store.parseExpr(defaultExpandAllExpr);
  }
  @computed get defaultExpandKeys() {
    let keys = this.store.execExpr(this.defaultExpandKeysExpr);
    if (isObservableObject(keys)) {
      keys = keys.slice();
    }
    return keys;
  }
  set defaultExpandKeys(defaultExpandKeysExpr) {
    this.defaultExpandKeysExpr = this.store.parseExpr(defaultExpandKeysExpr);
  }

  @observable data = [];
  @observable total;
  @observable loading = false;

  @computed get loaded() {
    return this.total !== undefined;
  }

  @computed get dataSource() {
    const data = this.data.slice();
    // 转成tree结构
    return getTreeTable(data, this.rootIdValue, {
      idField: this.idField,
      pidField: this.pidField,
      sortField: this.sortField,
    });
  }

  @action async load(refresh = false) {
    if (refresh || !this.total || this.data.length < this.total) {
      this.loading = true;
      try {
        const {
          results,
          total
        } = await queryData(this.query, {
          ...this.variables,
          limit: this.pageSize,
          offset: refresh ? 0 : this.data.length
        });
        this.total = total;
        this.data.splice(this.data.length, refresh ? this.data.length : 0, results);
        this.loading = false;
      } catch (err) {
        this.loading = false;
        throw err;
      }
    }
  }

  constructor(store, name, typeExpr = 'text', textExpr, placeholderExpr, clearExpr = false, visibleExpr = true, disableExpr = false, sizeExpr = 'default',
    maxLengthExpr, widthExpr, defaultValueExpr, getValueExpr, setValueExpr, mappingExpr, formatExpr = '', errorExpr = true, extraExpr,
    onBeforeChange, onChange, onAfterChange, onBeforeBlur, onBlur, onAfterBlur, onBeforeFocus, onFocus, onAfterFocus, onBeforeErrorClick,
    onErrorClick, onAfterErrorClick, onBeforeExtraClick, onExtraClick, onAfterExtraClick,
    dropdownStyleExpr,
    multipleExpr,
    showSearchExpr,
    queryExpr,
    variablesExpr,
    displayFieldExpr,
    sortFieldExpr,
    showHeaderExpr,
    columns,
    pageSizeExpr,
    idFieldExpr, pidFieldExpr, rootIdValueExpr, defaultExpandAllExpr, defaultExpandKeysExpr) {
    super(store, name, typeExpr, textExpr, placeholderExpr, clearExpr, visibleExpr, disableExpr, sizeExpr,
      maxLengthExpr, widthExpr, defaultValueExpr, getValueExpr, setValueExpr, mappingExpr, formatExpr, errorExpr, extraExpr,
      onBeforeChange, onChange, onAfterChange, onBeforeBlur, onBlur, onAfterBlur, onBeforeFocus, onFocus, onAfterFocus, onBeforeErrorClick,
      onErrorClick, onAfterErrorClick, onBeforeExtraClick, onExtraClick, onAfterExtraClick)

    this.dropdownStyleExpr = store.parseExpr(dropdownStyleExpr || 'table');
    this.multipleExpr = store.parseExpr(multipleExpr || false);
    this.showSearchExpr = store.parseExpr(showSearchExpr || true);
    this.queryExpr = store.parseExpr(queryExpr);
    this.variablesExpr = store.parseExpr(variablesExpr);
    this.displayFieldExpr = store.parseExpr(displayFieldExpr);
    this.sortFieldExpr = store.parseExpr(sortFieldExpr);
    this.showHeaderExpr = store.parseExpr(showHeaderExpr || this.dropdownStyle === 'table');
    this.pageSizeExpr = store.parseExpr(pageSizeExpr || 20);
    if (!columns) {
      // list 和 tree 不显示header
      if (this.dropdownStyle !== 'table') {
        columns = [{
          key: 'value',
          dataIndex: 'value'
        }]
      }
    }
    this.columns = columns;
    this.idFieldExpr = store.parseExpr(idFieldExpr || 'id');
    this.pidFieldExpr = store.parseExpr(pidFieldExpr || 'pid');
    this.rootIdValueExpr = store.parseExpr(rootIdValueExpr);
    this.defaultExpandAllExpr = store.parseExpr(defaultExpandAllExpr || false);
    this.defaultExpandKeysExpr = store.parseExpr(defaultExpandKeysExpr);
  }
}
