import {
  observable,
  computed,
  action,
  isObservableObject
} from "mobx";
import moment from 'moment';
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
import UIStore from '../UIStore';

export class Input {
  store;
  key;

  name;
  @observable typeExpr;
  @observable setTypeExpr;
  @observable textExpr;
  @observable setTextExpr;
  @observable placeholderExpr;
  @observable setPlaceholderExpr;
  @observable clearExpr;
  @observable setClearExpr;
  @observable visibleExpr;
  @observable setVisibleExpr;
  @observable disableExpr;
  @observable setDisableExpr;
  @observable editableExpr;
  @observable setEditableExpr; // 不可任意编辑，但是能选择候选项
  @observable maxLengthExpr;
  @observable setMaxLengthExpr;
  @observable sizeExpr;
  @observable setSizeExpr;
  @observable widthExpr;
  @observable setWidthExpr;
  @observable defaultValueExpr;
  @observable setDefaultValueExpr;
  @observable errorExpr;
  @observable setErrorExpr;
  @observable extraExpr;
  @observable setExtraExpr;
  // format仅仅对显示字段进行格式化，不能改变显示字段
  @observable formatExpr;
  @observable setFormatExpr;

  // 这个就是值表达式，或者一个常量值
  @observable valueExpr;
  @observable setValueExpr;
  // 赋值映射
  @observable mappingExpr;
  @observable setMappingExpr;
  // 赋值表达式，返回一个固定的字段名
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
  @computed get text() {
    return this.store.execExpr(this.textExpr);
  }
  set text(value) {
    if (this.setText) {
      return this.store.setViewModel(this.setText, value);
    }
    this.textExpr = UIStore.parseExpr(value);
  }
  @computed get setText() {
    return this.store.execExpr(this.setTextExpr);
  }
  set setText(setValue) {
    this.setTextExpr = UIStore.parseExpr(setValue);
  }
  @computed get placeholder() {
    return this.store.execExpr(this.placeholderExpr);
  }
  set placeholder(value) {
    if (this.setPlaceholder) {
      return this.store.setViewModel(this.setPlaceholder, value);
    }
    this.placeholderExpr = UIStore.parseExpr(value);
  }
  @computed get setPlaceholder() {
    return this.store.execExpr(this.setPlaceholderExpr);
  }
  set setPlaceholder(setValue) {
    this.setPlaceholderExpr = UIStore.parseExpr(setValue);
  }
  @computed get clear() {
    return this.store.execExpr(this.clearExpr);
  }
  set clear(value) {
    if (this.setClear) {
      return this.store.setViewModel(this.setClear, value);
    }
    this.clearExpr = UIStore.parseExpr(value);
  }
  @computed get setClear() {
    return this.store.execExpr(this.setClearExpr);
  }
  set setClear(setValue) {
    this.setClearExpr = UIStore.parseExpr(setValue);
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
  @computed get editable() {
    return this.store.execExpr(this.editableExpr);
  }
  set editable(value) {
    if (this.setEditable) {
      return this.store.setViewModel(this.setEditable, value);
    }
    this.editableExpr = UIStore.parseExpr(value);
  }
  @computed get setEditable() {
    return this.store.execExpr(this.setEditableExpr);
  }
  set setEditable(setValue) {
    this.setEditableExpr = UIStore.parseExpr(setValue);
  }
  @computed get size() {
    return this.store.execExpr(this.sizeExpr);
  }
  set size(value) {
    if (this.setSize) {
      return this.store.setViewModel(this.setSize, value);
    }
    this.sizeExpr = UIStore.parseExpr(value);
  }
  @computed get setSize() {
    return this.store.execExpr(this.setSizeExpr);
  }
  set setSize(setValue) {
    this.setSizeExpr = UIStore.parseExpr(setValue);
  }
  @computed get maxLength() {
    return this.store.execExpr(this.maxLengthExpr);
  }
  set maxLength(value) {
    if (this.setMaxLength) {
      return this.store.setViewModel(this.setMaxLength, value);
    }
    this.maxLengthExpr = UIStore.parseExpr(value);
  }
  @computed get setMaxLength() {
    return this.store.execExpr(this.setMaxLengthExpr);
  }
  set setMaxLength(setValue) {
    this.setMaxLengthExpr = UIStore.parseExpr(setValue);
  }
  @computed get width() {
    return this.store.execExpr(this.widthExpr);
  }
  set width(value) {
    if (this.setWidth) {
      return this.store.setViewModel(this.setWidth, value);
    }
    this.widthExpr = UIStore.parseExpr(value);
  }
  @computed get setWidth() {
    return this.store.execExpr(this.setWidthExpr);
  }
  set setWidth(setValue) {
    this.setWidthExpr = UIStore.parseExpr(setValue);
  }

  @computed get defaultValue() {
    return this.store.execExpr(this.defaultValueExpr);
  }
  set defaultValue(value) {
    if (this.setDefaultValue) {
      return this.store.setViewModel(this.setDefaultValue, value);
    }
    this.defaultValueExpr = UIStore.parseExpr(value);
  }
  @computed get setDefaultValue() {
    return this.store.execExpr(this.setDefaultValueExpr);
  }
  set setDefaultValue(setValue) {
    this.setDefaultValueExpr = UIStore.parseExpr(setValue);
  }

  @computed get value() {
    return this.store.execExpr(this.valueExpr);
  }
  set value(value) {
    if (this.setValue) {
      return this.store.setViewModel(this.setValue, value);
    }
    this.valueExpr = UIStore.parseExpr(value);
  }
  @computed get setValue() {
    return this.store.execExpr(this.setValueExpr);
  }
  set setValue(setValueExpr) {
    this.setValueExpr = UIStore.parseExpr(setValueExpr);
  }

  @computed get mapping() {
    return this.store.execExpr(this.mappingExpr);
  }
  set mapping(value) {
    if (this.setMapping) {
      return this.store.setViewModel(this.setMapping, value);
    }
    this.mappingExpr = UIStore.parseExpr(value);
  }
  @computed get setMapping() {
    return this.store.execExpr(this.setMappingExpr);
  }
  set setMapping(setValue) {
    this.setMappingExpr = UIStore.parseExpr(setValue);
  }
  @computed get format() {
    return this.store.execExpr(this.formatExpr);
  }
  set format(value) {
    if (this.setFormat) {
      return this.store.setViewModel(this.setFormat, value);
    }
    this.formatExpr = UIStore.parseExpr(value);
  }
  @computed get setFormat() {
    return this.store.execExpr(this.setFormatExpr);
  }
  set setFormat(setValue) {
    this.setFormatExpr = UIStore.parseExpr(setValue);
  }
  @computed get error() {
    return this.store.execExpr(this.errorExpr);
  }
  set error(value) {
    if (this.setError) {
      return this.store.setViewModel(this.setError, value);
    }
    this.errorExpr = UIStore.parseExpr(value);
  }
  @computed get setError() {
    return this.store.execExpr(this.setErrorExpr);
  }
  set setError(setValue) {
    this.setErrorExpr = UIStore.parseExpr(setValue);
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

  toString() {
    return this.type + ':' + this.name;
  }

  constructor(store, name, typeExpr, setTypeExpr, textExpr, setTextExpr, placeholderExpr, setPlaceholderExpr,
    clearExpr, setClearExpr, visibleExpr, setVisibleExpr, disableExpr, setDisableExpr, editableExpr, setEditableExpr, sizeExpr, setSizeExpr,
    maxLengthExpr, setMaxLengthExpr, widthExpr, setWidthExpr, defaultValueExpr, setDefaultValueExpr, valueExpr, setValueExpr,
    mappingExpr, setMappingExpr, formatExpr, setFormatExpr, errorExpr, setErrorExpr, extraExpr, setExtraExpr,
    onBeforeChange, onChange, onAfterChange, onBeforeBlur, onBlur, onAfterBlur, onBeforeFocus, onFocus, onAfterFocus, onBeforeErrorClick,
    onErrorClick, onAfterErrorClick, onBeforeExtraClick, onExtraClick, onAfterExtraClick) {

    this.key = assignId('Input');
    this.store = store;
    this.name = name || this.key;

    this.typeExpr = typeExpr;
    this.setTypeExpr = setTypeExpr;
    this.textExpr = textExpr;
    this.setTextExpr = setTextExpr;
    this.placeholderExpr = placeholderExpr;
    this.setPlaceholderExpr = setPlaceholderExpr;
    this.clearExpr = clearExpr;
    this.setClearExpr = setClearExpr;
    this.disableExpr = disableExpr;
    this.setDisableExpr = setDisableExpr;
    this.editableExpr = editableExpr;
    this.setEditableExpr = setEditableExpr;
    this.visibleExpr = visibleExpr;
    this.setVisibleExpr = setVisibleExpr;
    this.sizeExpr = sizeExpr;
    this.setSizeExpr = setSizeExpr;
    this.maxLengthExpr = maxLengthExpr;
    this.setMaxLengthExpr = setMaxLengthExpr;
    this.widthExpr = widthExpr;
    this.setWidthExpr = setWidthExpr;
    this.defaultValueExpr = defaultValueExpr;
    this.setDefaultValueExpr = setDefaultValueExpr;
    this.valueExpr = valueExpr;
    this.setValueExpr = setValueExpr;
    this.mappingExpr = mappingExpr;
    this.setMappingExpr = setMappingExpr;
    this.formatExpr = formatExpr;
    this.setFormatExpr = setFormatExpr;
    this.errorExpr = errorExpr;
    this.setErrorExpr = setErrorExpr;
    this.extraExpr = extraExpr;
    this.setExtraExpr = setExtraExpr;

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

  static createSchema(config) {
    console.log('parse %s input...', config.name || config.type)
    if (config.type === 'money' || config.type === 'decimal') {
      config.type = 'number';
      config.format = config.format || 'thousandth';
    }
    const args = [
      UIStore.parseExpr(config.type), UIStore.parseExpr(config.setType),
      UIStore.parseExpr(config.text), UIStore.parseExpr(config.setText),
      UIStore.parseExpr(config.placeholder), UIStore.parseExpr(config.setPlaceholder),
      UIStore.parseExpr(config.clear || false), UIStore.parseExpr(config.setClear ),
      UIStore.parseExpr(config.visible || true), UIStore.parseExpr(config.setVisible ),
       UIStore.parseExpr(config.disable || false), UIStore.parseExpr(config.setDisable ),
      UIStore.parseExpr(config.editable || true), UIStore.parseExpr(config.setEditable),
      UIStore.parseExpr(config.size || 'default'), UIStore.parseExpr(config.setSize ),
      UIStore.parseExpr(config.maxLength), UIStore.parseExpr(config.setMaxLength),
       UIStore.parseExpr(config.width), UIStore.parseExpr(config.setWidth),
      UIStore.parseExpr(config.defaultValue), UIStore.parseExpr(config.setDefaultValue),
       UIStore.parseExpr(config.value), UIStore.parseExpr(config.setValue),
       UIStore.parseExpr(config.mapping), UIStore.parseExpr(config.setMapping),
      UIStore.parseExpr(config.format), UIStore.parseExpr(config.setFormat),
      UIStore.parseExpr(config.error || true), UIStore.parseExpr(config.setError ),
      UIStore.parseExpr(config.extra), UIStore.parseExpr(config.setExtra),
      UIStore.parseExpr(config.min || -Infinity), UIStore.parseExpr(config.setMin ),
      UIStore.parseExpr(config.max || Infinity), UIStore.parseExpr(config.setMax),
      Action.createSchema(config.onChanging),
      Action.createSchema(config.onChange), Action.createSchema(config.onChanged), Action.createSchema(config.onBluring),
      Action.createSchema(config.onBlur), Action.createSchema(config.onBlured), Action.createSchema(config.onFocusing),
      Action.createSchema(config.onFocus), Action.createSchema(config.onFocused), Action.createSchema(config.onErrorClicking),
      Action.createSchema(config.onErrorClick), Action.createSchema(config.onErrorClicked),
      Action.createSchema(config.onExtraClicking), Action.createSchema(config.onExtraClick),
      Action.createSchema(config.onExtraClicked)
    ];

    if (config.type === 'refselect') {
      return {
        type: RefInput,
        args: [config.name || config.type,
          Action.createSchema(config.onExtraClicked),
          UIStore.parseExpr(config.dropdownStyle || 'table'), UIStore.parseExpr(config.setDropdownStyle ),
          UIStore.parseExpr(config.multiple || false), UIStore.parseExpr(config.setMultiple ),
          UIStore.parseExpr(config.showSearch || true), UIStore.parseExpr(config.setShowSearch ),
          UIStore.parseExpr(config.query), UIStore.parseExpr(config.setQuery),
          UIStore.parseExpr(config.variables), UIStore.parseExpr(config.setVariables),
          UIStore.parseExpr(config.displayField), UIStore.parseExpr(config.setDisplayField),
          UIStore.parseExpr(config.sortField), UIStore.parseExpr(config.setSortField),
          UIStore.parseExpr(config.showHeader || this.dropdownStyle === 'table'), UIStore.parseExpr(config.setShowHeader ),
          UIStore.parseExpr(config.columns), UIStore.parseExpr(config.setColumns), 
          UIStore.parseExpr(config.pageSize || 20), UIStore.parseExpr(config.setPageSize ),
          UIStore.parseExpr(config.idField || 'id'), UIStore.parseExpr(config.setIdField ),
          UIStore.parseExpr(config.pidField || 'pid'), UIStore.parseExpr(config.setPidField ),
          UIStore.parseExpr(config.rootIdValue), UIStore.parseExpr(config.setRootIdValue),
          UIStore.parseExpr(config.defaultExpandAll || false), UIStore.parseExpr(config.setDefaultExpandAll ),
          UIStore.parseExpr(config.defaultExpandKeys),
            ...args
        ]
      };
    } else if (config.type === 'inputtable' || config.type === 'table') {
      return {
        type: InputTable,
        args: [config.name || config.type,
          EditTable.createSchema(config.table),
          ...args
        ]
      };
    } else if (config.type === 'select') {
      return {
        type: Select,
        args: [config.name || config.type,
          UIStore.parseExpr(config.dataSource), UIStore.parseExpr(config.setDataSource),
          UIStore.parseExpr(config.mode), UIStore.parseExpr(config.setMode),
          UIStore.parseExpr(config.displayField || 'id'), UIStore.parseExpr(config.setDisplayField ),
          UIStore.parseExpr(config.valueField || 'id'), UIStore.parseExpr(config.setValueField ),
          UIStore.parseExpr(config.sortField), UIStore.parseExpr(config.setSortField),
          ...args
        ]
      };
    } else if (config.type === 'treeselect') {
      return {
        type: TreeSelect,
        args: [config.name || config.type,
          UIStore.parseExpr(config.dataSource), UIStore.parseExpr(config.setDataSource),
          UIStore.parseExpr(config.mode), UIStore.parseExpr(config.setMode),
          UIStore.parseExpr(config.displayField), UIStore.parseExpr(config.setDisplayField),
          UIStore.parseExpr(config.valueField), UIStore.parseExpr(config.setValueField),
          UIStore.parseExpr(config.sortField), UIStore.parseExpr(config.setSortField),
          UIStore.parseExpr(config.showSearch || false), UIStore.parseExpr(config.setShowSearch ),
          UIStore.parseExpr(config.allowClear || true), UIStore.parseExpr(config.setAllowClear ),
          UIStore.parseExpr(config.treeDefaultExpandAll || true), UIStore.parseExpr(config.setTreeDefaultExpandAll),
          UIStore.parseExpr(config.maxHeight || 400), UIStore.parseExpr(config.setMaxHeight ),
          UIStore.parseExpr(config.treeCheckable || false), UIStore.parseExpr(config.setTreeCheckable),
          UIStore.parseExpr(config.idField || 'id'), UIStore.parseExpr(config.setIdField ),
          UIStore.parseExpr(config.pidField || 'pid'), UIStore.parseExpr(config.setPidField ),
          UIStore.parseExpr(config.rootIdValue), UIStore.parseExpr(config.setRootIdValue),
          ...args
        ]
      };
    } else if (config.type === 'number') {
      return {
        type: NumberInput,
        args: [config.name || config.type, ...args]
      };
    } else {
      if (!config.format) {
        switch (config.type) {
        case 'date':
        case 'daterange':
          config.format = "YYYY-MM-DD";
          break;
        case 'datetime':
          config.format = "YYYY-MM-DD HH:mm:ss";
          break;
        case 'time':
          config.format = "HH:mm:ss";
          break;
        case 'week':
          config.format = "YYYY-wo";
          break;
        case 'month':
          config.format = "YYYY-MM";
          break;
        }
      }
      return {
        type: Input,
        args: [config.name || config.type, ...args]
      };
    }
  }
}

export class NumberInput extends Input {

  @observable minExpr;
  @observable setMinExpr;
  @observable maxExpr;
  @observable setMaxExpr;

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

  constructor(store, name, minExpr, setMinExpr, maxExpr, setMaxExpr, ...other) {
    super(store, name, ...other);

    this.minExpr = minExpr;
    this.setMinExpr = setMinExpr;
    this.maxExpr = maxExpr;
    this.setMaxExpr = setMaxExpr;
  }
}

export class Select extends Input {
  @observable modeExpr;
  @observable setModeExpr;
  @observable dataSourceExpr;
  @observable setDataSourceExpr;
  @observable displayFieldExpr;
  @observable setDisplayFieldExpr;
  @observable valueFieldExpr;
  @observable setValueFieldExpr;
  @observable sortFieldExpr;
  @observable setSortFieldExpr;

  @computed get mode() {
    return this.store.execExpr(this.modeExpr);
  }
  set mode(value) {
    if (this.setMode) {
      return this.store.setViewModel(this.setMode, value);
    }
    this.modeExpr = UIStore.parseExpr(value);
  }
  @computed get setMode() {
    return this.store.execExpr(this.setModeExpr);
  }
  set setMode(setValue) {
    this.setModeExpr = UIStore.parseExpr(setValue);
  }

  @computed get value() {
    const value = super.value;
    if (isObservableObject(value)) {
      return value.slice();
    }
    return value;
  }

  @computed get displayField() {
    return this.store.execExpr(this.displayFieldExpr);
  }
  set displayField(value) {
    if (this.setDisplayField) {
      return this.store.setViewModel(this.setDisplayField, value);
    }
    this.displayFieldExpr = UIStore.parseExpr(value);
  }
  @computed get setDisplayField() {
    return this.store.execExpr(this.setDisplayFieldExpr);
  }
  set setDisplayField(setValue) {
    this.setDisplayFieldExpr = UIStore.parseExpr(setValue);
  }
  @computed get valueField() {
    return this.store.execExpr(this.valueFieldExpr);
  }
  set valueField(value) {
    if (this.setValueField) {
      return this.store.setViewModel(this.setValueField, value);
    }
    this.valueFieldExpr = UIStore.parseExpr(value);
  }
  @computed get setValueField() {
    return this.store.execExpr(this.setValueFieldExpr);
  }
  set setValueField(setValue) {
    this.setValueFieldExpr = UIStore.parseExpr(setValue);
  }
  @computed get sortField() {
    return this.store.execExpr(this.sortFieldExpr);
  }
  set sortField(value) {
    if (this.setSortField) {
      return this.store.setViewModel(this.setSortField, value);
    }
    this.sortFieldExpr = UIStore.parseExpr(value);
  }
  @computed get setSortField() {
    return this.store.execExpr(this.setSortFieldExpr);
  }
  set setSortField(setValue) {
    this.setSortFieldExpr = UIStore.parseExpr(setValue);
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

  constructor(store, name,
    dataSourceExpr, setDataSourceExpr, modeExpr, setModeExpr, dataMappingExpr,
    setDataMappingExpr, displayFieldExpr, setDisplayFieldExpr, valueFieldExpr,
    setValueFieldExpr, sortFieldExpr, setSortFieldExpr,
    ...other) {
    super(store, name, ...other);

    this.dataSourceExpr = dataSourceExpr ;
    this.setDataSourceExpr = setDataSourceExpr;
    this.modeExpr = modeExpr;
    this.setModeExpr = setModeExpr;
    this.dataMappingExpr = dataMappingExpr;
    this.setDataMappingExpr = setDataMappingExpr;

    this.displayFieldExpr = displayFieldExpr;
    this.setDisplayFieldExpr = setDisplayFieldExpr;
    this.valueFieldExpr = valueFieldExpr;
    this.setValueFieldExpr = setValueFieldExpr;
    this.sortFieldExpr = sortFieldExpr;
    this.setSortFieldExpr = setSortFieldExpr;
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
  @observable setIdFieldExpr;
  @observable pidFieldExpr;
  @observable setPidFieldExpr;

  @observable showSearchExpr;
  @observable setShowSearchExpr;
  @observable allowClearExpr;
  @observable setAllowClearExpr;
  @observable treeDefaultExpandAllExpr;
  @observable setTreeDefaultExpandAllExpr;
  @observable maxHeightExpr;
  @observable setMaxHeightExpr;
  @observable treeCheckableExpr;
  @observable setTreeCheckableExpr;
  @observable rootIdValueExpr;
  @observable setRootIdValueExpr;

  @computed get multiple() {
    return this.mode === 'multiple';
  }
  set multiple(value) {
    if (this.setMultiple) {
      return this.store.setViewModel(this.setMultiple, value);
    }
    this.multipleExpr = UIStore.parseExpr(value);
  }
  @computed get setMultiple() {
    return this.store.execExpr(this.setMultipleExpr);
  }
  set setMultiple(setValue) {
    this.setMultipleExpr = UIStore.parseExpr(setValue);
  }

  @computed get showSearch() {
    return this.store.execExpr(this.showSearchExpr);
  }
  set showSearch(value) {
    if (this.setShowSearch) {
      return this.store.setViewModel(this.setShowSearch, value);
    }
    this.showSearchExpr = UIStore.parseExpr(value);
  }
  @computed get setShowSearch() {
    return this.store.execExpr(this.setShowSearchExpr);
  }
  set setShowSearch(setValue) {
    this.setShowSearchExpr = UIStore.parseExpr(setValue);
  }
  @computed get allowClear() {
    return this.store.execExpr(this.allowClearExpr);
  }
  set allowClear(value) {
    if (this.setAllowClear) {
      return this.store.setViewModel(this.setAllowClear, value);
    }
    this.allowClearExpr = UIStore.parseExpr(value);
  }
  @computed get setAllowClear() {
    return this.store.execExpr(this.setAllowClearExpr);
  }
  set setAllowClear(setValue) {
    this.setAllowClearExpr = UIStore.parseExpr(setValue);
  }
  @computed get treeDefaultExpandAll() {
    return this.store.execExpr(this.treeDefaultExpandAllExpr);
  }
  set treeDefaultExpandAll(value) {
    if (this.setTreeDefaultExpandAll) {
      return this.store.setViewModel(this.setTreeDefaultExpandAll, value);
    }
    this.treeDefaultExpandAllExpr = UIStore.parseExpr(value);
  }
  @computed get setTreeDefaultExpandAll() {
    return this.store.execExpr(this.setTreeDefaultExpandAllExpr);
  }
  set setTreeDefaultExpandAll(setValue) {
    this.setTreeDefaultExpandAllExpr = UIStore.parseExpr(setValue);
  }
  @computed get maxHeight() {
    return this.store.execExpr(this.maxHeightExpr);
  }
  set maxHeight(value) {
    if (this.setMaxHeight) {
      return this.store.setViewModel(this.setMaxHeight, value);
    }
    this.maxHeightExpr = UIStore.parseExpr(value);
  }
  @computed get setMaxHeight() {
    return this.store.execExpr(this.setMaxHeightExpr);
  }
  set setMaxHeight(setValue) {
    this.setMaxHeightExpr = UIStore.parseExpr(setValue);
  }
  @computed get treeCheckable() {
    return this.store.execExpr(this.treeCheckableExpr);
  }
  set treeCheckable(value) {
    if (this.setTreeCheckable) {
      return this.store.setViewModel(this.setTreeCheckable, value);
    }
    this.treeCheckableExpr = UIStore.parseExpr(value);
  }
  @computed get setTreeCheckable() {
    return this.store.execExpr(this.setTreeCheckableExpr);
  }
  set setTreeCheckable(setValue) {
    this.setTreeCheckableExpr = UIStore.parseExpr(setValue);
  }

  @computed get idField() {
    return this.store.execExpr(this.idFieldExpr);
  }
  set idField(value) {
    if (this.setIdField) {
      return this.store.setViewModel(this.setIdField, value);
    }
    this.idFieldExpr = UIStore.parseExpr(value);
  }
  @computed get setIdField() {
    return this.store.execExpr(this.setIdFieldExpr);
  }
  set setIdField(setValue) {
    this.setIdFieldExpr = UIStore.parseExpr(setValue);
  }
  @computed get pidField() {
    return this.store.execExpr(this.pidFieldExpr);
  }
  set pidField(value) {
    if (this.setPidField) {
      return this.store.setViewModel(this.setPidField, value);
    }
    this.pidFieldExpr = UIStore.parseExpr(value);
  }
  @computed get setPidField() {
    return this.store.execExpr(this.setPidFieldExpr);
  }
  set setPidField(setValue) {
    this.setPidFieldExpr = UIStore.parseExpr(setValue);
  }
  @computed get rootIdValue() {
    return this.store.execExpr(this.rootIdValueExpr);
  }
  set rootIdValue(value) {
    if (this.setRootIdValue) {
      return this.store.setViewModel(this.setRootIdValue, value);
    }
    this.rootIdValueExpr = UIStore.parseExpr(value);
  }
  @computed get setRootIdValue() {
    return this.store.execExpr(this.setRootIdValueExpr);
  }
  set setRootIdValue(setValue) {
    this.setRootIdValueExpr = UIStore.parseExpr(setValue);
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

  constructor(store, name,
    showSearchExpr, setShowSearchExpr, allowClearExpr, setAllowClearExpr,
    treeDefaultExpandAllExpr, setTreeDefaultExpandAllExpr, maxHeightExpr,
    setMaxHeightExpr, treeCheckableExpr, setTreeCheckableExpr,
    idFieldExpr, setIdFieldExpr, pidFieldExpr, setPidFieldExpr, rootIdValueExpr, setRootIdValueExpr,
    ...other) {
    super(store, name, ...other);

    this.showSearchExpr = showSearchExpr;
    this.setShowSearchExpr = setShowSearchExpr;
    this.allowClearExpr = allowClearExpr;
    this.setAllowClearExpr = setAllowClearExpr;
    this.treeDefaultExpandAllExpr = treeDefaultExpandAllExpr;
    this.setTreeDefaultExpandAllExpr = setTreeDefaultExpandAllExpr;
    this.maxHeightExpr = maxHeightExpr;
    this.setMaxHeightExpr = setMaxHeightExpr;
    this.treeCheckableExpr = treeCheckableExpr;
    this.setTreeCheckableExpr = setTreeCheckableExpr;

    this.idFieldExpr = idFieldExpr;
    this.setIdFieldExpr = setIdFieldExpr;
    this.pidFieldExpr = pidFieldExpr;
    this.setPidFieldExpr = setPidFieldExpr;
    this.rootIdValueExpr = rootIdValueExpr;
    this.setRootIdValueExpr = setRootIdValueExpr;
  }
}

export class InputTable extends Input {
  @observable table;

  constructor(store, name, table, ...other) {
    super(store, name, ...other);

    this.table = table;
  }
}

export class RefInput extends Input {
  @observable dropdownStyleExpr;
  @observable setDropdownStyleExpr;
  @observable multipleExpr;
  @observable setMultipleExpr;
  @observable showSearchExpr;
  @observable setShowSearchExpr;
  @observable queryExpr;
  @observable setQueryExpr;
  @observable variablesExpr;
  @observable setVariablesExpr;
  @observable displayFieldExpr;
  @observable setDisplayFieldExpr;
  @observable sortFieldExpr;
  @observable setSortFieldExpr;
  @observable showHeaderExpr;
  @observable setShowHeaderExpr;
  @observable pageSizeExpr;
  @observable setPageSizeExpr;

  @observable idFieldExpr;
  @observable setIdFieldExpr;
  @observable pidFieldExpr;
  @observable setPidFieldExpr;
  @observable rootIdValueExpr;
  @observable setRootIdValueExpr;
  @observable defaultExpandAllExpr;
  @observable setDefaultExpandAllExpr;
  @observable defaultExpandKeysExpr;
  @observable setDefaultExpandKeysExpr;

  set dropdownStyle(dropdownStyleExpr) {
    this.dropdownStyleExpr = UIStore.parseExpr(dropdownStyleExpr);
    this.showHeader = this.dropdownStyle === 'table';
  }
  @computed get dropdownStyle() {
    return this.store.execExpr(this.dropdownStyleExpr);
  }
  set multiple(value) {
    if (this.setMultiple) {
      return this.store.setViewModel(this.setMultiple, value);
    }
    this.multipleExpr = UIStore.parseExpr(value);
  }
  @computed get setMultiple() {
    return this.store.execExpr(this.setMultipleExpr);
  }
  set setMultiple(setValue) {
    this.setMultipleExpr = UIStore.parseExpr(setValue);
  }
  @computed get multiple() {
    return !!this.store.execExpr(this.multipleExpr);
  }
  set showSearch(value) {
    if (this.setShowSearch) {
      return this.store.setViewModel(this.setShowSearch, value);
    }
    this.showSearchExpr = UIStore.parseExpr(value);
  }
  @computed get setShowSearch() {
    return this.store.execExpr(this.setShowSearchExpr);
  }
  set setShowSearch(setValue) {
    this.setShowSearchExpr = UIStore.parseExpr(setValue);
  }
  @computed get showSearch() {
    return !!this.store.execExpr(this.showSearchExpr);
  }
  set query(value) {
    if (this.setQuery) {
      return this.store.setViewModel(this.setQuery, value);
    }
    this.queryExpr = UIStore.parseExpr(value);
  }
  @computed get setQuery() {
    return this.store.execExpr(this.setQueryExpr);
  }
  set setQuery(setValue) {
    this.setQueryExpr = UIStore.parseExpr(setValue);
  }
  @computed get query() {
    return this.store.execExpr(this.queryExpr);
  }
  set variables(value) {
    if (this.setVariables) {
      return this.store.setViewModel(this.setVariables, value);
    }
    this.variablesExpr = UIStore.parseExpr(value);
  }
  @computed get setVariables() {
    return this.store.execExpr(this.setVariablesExpr);
  }
  set setVariables(setValue) {
    this.setVariablesExpr = UIStore.parseExpr(setValue);
  }
  @computed get variables() {
    return this.store.execExpr(this.variablesExpr);
  }
  set displayField(value) {
    if (this.setDisplayField) {
      return this.store.setViewModel(this.setDisplayField, value);
    }
    this.displayFieldExpr = UIStore.parseExpr(value);
  }
  @computed get setDisplayField() {
    return this.store.execExpr(this.setDisplayFieldExpr);
  }
  set setDisplayField(setValue) {
    this.setDisplayFieldExpr = UIStore.parseExpr(setValue);
  }
  @computed get displayField() {
    return this.store.execExpr(this.displayFieldExpr);
  }
  set sortField(value) {
    if (this.setSortField) {
      return this.store.setViewModel(this.setSortField, value);
    }
    this.sortFieldExpr = UIStore.parseExpr(value);
  }
  @computed get setSortField() {
    return this.store.execExpr(this.setSortFieldExpr);
  }
  set setSortField(setValue) {
    this.setSortFieldExpr = UIStore.parseExpr(setValue);
  }
  @computed get sortField() {
    return this.store.execExpr(this.sortFieldExpr);
  }
  set showHeader(value) {
    if (this.setShowHeader) {
      return this.store.setViewModel(this.setShowHeader, value);
    }
    this.showHeaderExpr = UIStore.parseExpr(value);
  }
  @computed get setShowHeader() {
    return this.store.execExpr(this.setShowHeaderExpr);
  }
  set setShowHeader(setValue) {
    this.setShowHeaderExpr = UIStore.parseExpr(setValue);
  }
  @computed get showHeader() {
    return !!this.store.execExpr(this.showHeaderExpr);
  }
  set pageSize(value) {
    if (this.setPageSize) {
      return this.store.setViewModel(this.setPageSize, value);
    }
    this.pageSizeExpr = UIStore.parseExpr(value);
  }
  @computed get setPageSize() {
    return this.store.execExpr(this.setPageSizeExpr);
  }
  set setPageSize(setValue) {
    this.setPageSizeExpr = UIStore.parseExpr(setValue);
  }
  @computed get pageSize() {
    return parseInt(this.store.execExpr(this.pageSizeExpr)) || 20;
  }

  @computed get idField() {
    return this.store.execExpr(this.idFieldExpr);
  }
  set idField(value) {
    if (this.setIdField) {
      return this.store.setViewModel(this.setIdField, value);
    }
    this.idFieldExpr = UIStore.parseExpr(value);
  }
  @computed get setIdField() {
    return this.store.execExpr(this.setIdFieldExpr);
  }
  set setIdField(setValue) {
    this.setIdFieldExpr = UIStore.parseExpr(setValue);
  }
  @computed get pidField() {
    return this.store.execExpr(this.pidFieldExpr);
  }
  set pidField(value) {
    if (this.setPidField) {
      return this.store.setViewModel(this.setPidField, value);
    }
    this.pidFieldExpr = UIStore.parseExpr(value);
  }
  @computed get setPidField() {
    return this.store.execExpr(this.setPidFieldExpr);
  }
  set setPidField(setValue) {
    this.setPidFieldExpr = UIStore.parseExpr(setValue);
  }
  @computed get rootIdValue() {
    return this.store.execExpr(this.rootIdValueExpr);
  }
  set rootIdValue(value) {
    if (this.setRootIdValue) {
      return this.store.setViewModel(this.setRootIdValue, value);
    }
    this.rootIdValueExpr = UIStore.parseExpr(value);
  }
  @computed get setRootIdValue() {
    return this.store.execExpr(this.setRootIdValueExpr);
  }
  set setRootIdValue(setValue) {
    this.setRootIdValueExpr = UIStore.parseExpr(setValue);
  }
  @computed get defaultExpandAll() {
    return !!this.store.execExpr(this.defaultExpandAllExpr);
  }
  set defaultExpandAll(value) {
    if (this.setDefaultExpandAll) {
      return this.store.setViewModel(this.setDefaultExpandAll, value);
    }
    this.defaultExpandAllExpr = UIStore.parseExpr(value);
  }
  @computed get setDefaultExpandAll() {
    return this.store.execExpr(this.setDefaultExpandAllExpr);
  }
  set setDefaultExpandAll(setValue) {
    this.setDefaultExpandAllExpr = UIStore.parseExpr(setValue);
  }
  @computed get defaultExpandKeys() {
    let keys = this.store.execExpr(this.defaultExpandKeysExpr);
    if (isObservableObject(keys)) {
      keys = keys.slice();
    }
    return keys;
  }
  set defaultExpandKeys(value) {
    if (this.setDefaultExpandKeys) {
      return this.store.setViewModel(this.setDefaultExpandKeys, value);
    }
    this.defaultExpandKeysExpr = UIStore.parseExpr(value);
  }
  @computed get setDefaultExpandKeys() {
    return this.store.execExpr(this.setDefaultExpandKeysExpr);
  }
  set setDefaultExpandKeys(setValue) {
    this.setDefaultExpandKeysExpr = UIStore.parseExpr(setValue);
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

  constructor(store, name,
    dropdownStyleExpr, setDropdownStyleExpr, multipleExpr, setMultipleExpr,
     showSearchExpr, setShowSearchExpr, queryExpr, setQueryExpr, variablesExpr,
     setVariablesExpr, displayFieldExpr, setDisplayFieldExpr, sortFieldExpr,
     setSortFieldExpr, showHeaderExpr, setShowHeaderExpr,
    columns,
    pageSizeExpr, setPageSizeExpr, idFieldExpr, setIdFieldExpr, pidFieldExpr,
    setPidFieldExpr, rootIdValueExpr, setRootIdValueExpr, defaultExpandAllExpr,
    setDefaultExpandAllExpr, defaultExpandKeysExpr, setDefaultExpandKeysExpr,
    ...other) {
    super(store, name, ...other)

    this.dropdownStyleExpr = dropdownStyleExpr;
    this.setDropdownStyleExpr = setDropdownStyleExpr;
    this.multipleExpr = multipleExpr;
    this.setMultipleExpr = setMultipleExpr;
    this.showSearchExpr = showSearchExpr;
    this.setShowSearchExpr = setShowSearchExpr;
    this.queryExpr = queryExpr;
    this.setQueryExpr = setQueryExpr;
    this.variablesExpr = variablesExpr;
    this.setVariablesExpr = setVariablesExpr;
    this.displayFieldExpr = displayFieldExpr;
    this.setDisplayFieldExpr = setDisplayFieldExpr;
    this.sortFieldExpr = sortFieldExpr;
    this.setSortFieldExpr = setSortFieldExpr;
    this.showHeaderExpr = showHeaderExpr;
    this.setShowHeaderExpr = setShowHeaderExpr;
    this.pageSizeExpr = pageSizeExpr;
    this.setPageSizeExpr = setPageSizeExpr;
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
    this.idFieldExpr = idFieldExpr;
    this.setIdFieldExpr = setIdFieldExpr;
    this.pidFieldExpr = pidFieldExpr;
    this.setPidFieldExpr = setPidFieldExpr;
    this.rootIdValueExpr = rootIdValueExpr;
    this.setRootIdValueExpr = setRootIdValueExpr;
    this.defaultExpandAllExpr = defaultExpandAllExpr;
    this.setDefaultExpandAllExpr = setDefaultExpandAllExpr;
    this.defaultExpandKeysExpr = defaultExpandKeysExpr;
    this.setDefaultExpandKeysExpr = setDefaultExpandKeysExpr;
  }
}
