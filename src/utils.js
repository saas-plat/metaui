import schema from 'async-validator';
import Expression from '@saas-plat/expression';
import _omitBy from 'lodash/omitBy';
import _isUndefined from 'lodash/isUndefined';
import moment from 'moment';
import mapper from 'automapper';
import {
  observable,
  extendObservable,
} from 'mobx';
import _isPlainObject from 'lodash/isPlainObject';
import _keys from 'lodash/keys';
import _isArray from 'lodash/isArray';
import _toArray from 'lodash/toArray';
import _toPlainObject from 'lodash/toPlainObject';
import _camelCase from 'lodash/camelCase';
import {
  SimpleModel,
  ListModel,
  TableModel,
  FilterModel
} from './models';

export function t(template, data) {
  return template.replace(/\{\{([\w\.]*)\}\}/g, function (str, key) {
    var keys = key.split("."),
      v = data[keys.shift()];
    for (var i = 0, l = keys.length; i < l; i++) v = v[keys[i]];
    return (typeof v !== "undefined" && v !== null) ? v : "";
  });
}

export const none = () => {}

export const mapobj = (obj, mapping) => {
  if (!mapping) {
    return obj;
  }
  const expr = new Expression(mapping);
  // 这里是有个问题，要是调用了异步函数，这里需要await
  // 异步函数表达式还没有支持
  if (expr.tree) {
    return expr.exec(obj);
  } else {
    return {};
  }
}

export const createValidator = (...fields) => {
  // https://github.com/yiminghe/async-validator
  var descriptor = fields.reduce((obj, {
    dataIndex = 'value',
    valueType,
    type,
    required,
    message,
    len,
    pattern,
    whitespace,
    min,
    max,
    defaultField, //  数组元素类型
    fields,
    transform,
    //validator,
    ...other // enum
  }) => {
    //     Type
    // Indicates the type of validator to use. Recognised type values are:
    //
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
    // any: Can be any type.
    if (!valueType) {
      switch (type) {
      case 'text':
        valueType = 'string';
        max = max || 255;
        break;
      case 'textarea':
        valueType = 'string';
        break;
      case 'decimal':
        valueType = 'float';
        break;
      case 'number':
        valueType = 'number';
        break;
      case 'check':
      case 'switch':
        valueType = 'boolean';
        break;
      case 'datetime':
      case 'month':
      case 'week':
      case 'time':
        valueType = 'date';
        break;
      case 'daterange':
        valueType = 'array';
        defaultField = defaultField || 'date';
        break;
      case 'refer':
        valueType = 'object';
        break;
      case 'subtable':
        valueType = 'array';
        break;
      default:
        valueType = type;
      }
    }
    return {
      ...obj,
      [dataIndex]: _omitBy({
        type: valueType,
        required,
        len,
        pattern,
        whitespace,
        min,
        max,
        enum: other.enum,
        defaultField,
        fields,
        message,
        transform(value) {
          return map(value, transform);
        },
        // validator(rule, value, callback) {
        //   callback(validator === false ? new Error(t('校验失败')) : undefined)
        // }
      }, _isUndefined)
    }
  }, {})
  //console.log(descriptor)
  return new schema(descriptor);
}


//const types = ["string", "object", "boolean", "array", "number", "expr", "date", 'reference'];
const vmtypes = ['SimpleModel', 'ListModel', 'TableModel', 'FilterModel'];

export const map = async (obj, mapping) => {
  if (!mapping) {
    return obj;
  }
  const expr = new Expression(mapping);
  // 这里是有个问题，要是调用了异步函数，这里需要await
  // 异步函数表达式还没有支持
  if (expr.tree) {
    return expr.exec(obj);
  } else {
    return {};
  }
}

export const findFields = (fields, path, i = 0) => {
  let key = path[i];
  if (key.endsWith(']')) {
    key = key.substr(0, key.indexOf('['))
  }
  const sub = fields.find(it => it.key === key);
  if (i + 1 < path.length) {
    return findFields(sub.fields, path, i + 1);
  }
  if (!sub) {
    throw new Error(key + ' not defined!');
  }
  return sub.fields;
}

export const createObject = (defineObj = {}, fields, cutRef = false) => {
  (fields || []).forEach(it => {
    switch (it.type) {
    case 'array':
      if (cutRef) {
        defineObj[it.key] = it.defValue || [];
      } else {
        extendObservable(defineObj, {
          [it.key]: it.defValue || []
        });
      }
      break;
    case 'SimpleModel':
    case 'ListModel':
    case 'TableModel':
    case 'FilterModel':
    case 'reference':
    case 'object':
      if (cutRef && it.type === 'reference') {
        const idField = it.fields.find(it => it.key.toLowerCase() === 'id');
        if (idField) {
          defineObj[it.key] = {
            [idField.key]: ''
          };
        } else {
          defineObj[it.key] = {};
        }
      } else {
        let props = createObject({}, it.fields, cutRef);
        if (vmtypes.indexOf(it.type) > -1) {
          // 视图模型是一种特殊的对象类型
          const VMModel = it.type === 'FilterModel' ? FilterModel :
            it.type === 'ListModel' ? ListModel :
            it.type === 'TableModel' ? TableModel : SimpleModel;
          props = new VMModel(props);
        }
        // debug(defineObj,{
        //   [it.key]: props
        // },subDecs)
        extendObservable(defineObj, {
          [it.key]: it.type === 'reference' ? observable.ref(props) : props
        });
      }

      break;
    case 'string':
      if (cutRef) {
        defineObj[it.key] = it.defValue !== undefined ? String(it.defValue || '') : null;
      } else {
        extendObservable(defineObj, {
          [it.key]: it.defValue !== undefined ? String(it.defValue || '') : null
        });
      }
      break;
    case 'number':
      if (cutRef) {
        defineObj[it.key] = it.defValue !== undefined ? Number(it.defValue || 0) : null;
      } else {
        extendObservable(defineObj, {
          [it.key]: it.defValue !== undefined ? Number(it.defValue || 0) : null
        });
      }
      break;
    case 'boolean':
      if (cutRef) {
        defineObj[it.key] = it.defValue !== undefined ? Boolean(it.defValue || false) : null;
      } else {
        extendObservable(defineObj, {
          [it.key]: it.defValue !== undefined ? Boolean(it.defValue || false) : null
        });
      }
      break;
    case 'date':
      if (it.defValue === 'now') {
        if (cutRef) {
          defineObj[it.key] = Date.now;
        } else {
          extendObservable(defineObj, {
            [it.key]: Date.now
          });
        }
      } else {
        if (cutRef) {
          defineObj[it.key] = it.defValue !== undefined ? moment(it.defValue).toDate() : null;
        } else {
          extendObservable(defineObj, {
            [it.key]: it.defValue !== undefined ? moment(it.defValue).toDate() : null
          });
        }
      }
      break;
    case 'expression':
      {
        let texpr = new Expression(it.expr);
        // getter setter 自动转成计算属性
        Object.defineProperty(defineObj, it.key, {
          enumerable: true, // 这里必须是可枚举的要不extendObservable不好使
          get: () => {
            return texpr.exec(this);
          },
          set: (expr) => {
            texpr = new Expression(expr);
          }
        });
      }
      break;
    case 'mapping':
      {
        // getter setter 自动转成计算属性
        Object.defineProperty(defineObj, it.key, {
          enumerable: true, // 这里必须是可枚举的要不extendObservable不好使
          get: () => {
            return this[it.mapping]
          },
          set: (val) => {
            this[it.mapping] = val;
          }
        });
      }
      break;
    default:
      if (cutRef) {
        defineObj[it.key] = it.defValue || null;
      } else {
        extendObservable(defineObj, {
          [it.key]: it.defValue || null
        });
      }
    }
  });
  return defineObj;
}

export const createValue = (id, fields, key, value) => {
  fields = findFields(fields, key.split('.'));
  let subObj;
  if (fields) {
    subObj = createObject({}, fields);
    const paths = [id, ...key.split('.')].map(key => key.endsWith(']') ? key.substr(0, key.indexOf('[')) : key);
    //debug('pushValue', key);
    mapper.map('dto', paths.join('_'), value, subObj);
  } else {
    // TODO 这里还需要类型转换
    // 比如value是string，但是type是date，需要转换成Date
    subObj = value;
  }
  return subObj;
}

export const createMapping = (fields, name) => {
  const dtom = mapper.createMap('dto', name);
  const mtod = mapper.createMap(name, 'dto');
  //console.log('Type', name, fields);
  (fields || []).forEach(it => {
    switch (it.type) {
    case 'ListModel':
    case 'TableModel':
    case 'FilterModel':
      // TODO 这三种不能进行简单的object装换
      break;
    case 'array':
      createMapping(it.fields, name + '_' + it.key);
      dtom.forMember(it.key, function () {
        const sourceValue = this.__sourceValue[it.key];
        const destinationValue = this.__destinationValue[it.key];
        if (sourceValue instanceof Array) {
          destinationValue.length = sourceValue.length;
          // 如果是数组就循环赋值
          for (var i = 0; i < sourceValue.length; i += 1) {
            if (it.fields && it.fields.length > 0) {
              // map前必须定义结构
              if (destinationValue.length <= i || !destinationValue[i]) {
                createMapping(it.fields, name + '_' + it.key);
                destinationValue[i] = createObject({}, it.fields);
              }
              mapper.map('dto', name + '_' + it.key, sourceValue[i], destinationValue[i]);
            } else {
              destinationValue[i] = sourceValue[i];
            }
          }
        } else if (sourceValue !== undefined) {
          // 可以是一个对象，直接赋给数组的第一个元素上
          destinationValue.length = 0;
          if (it.fields && it.fields.length > 0) {
            createMapping(it.fields, name + '_obj' + it.key);
            destinationValue[0] = createObject({}, it.fields);
            mapper.map('dto', name + '_obj' + it.key, sourceValue, destinationValue[0]);
          } else {
            destinationValue[0] = sourceValue;
          }
        }
      });
      mtod.forMember(it.key, function () {
        const sourceValue = this.__sourceValue[it.key];
        const destinationValue = this.__destinationValue[it.key];
        if (Array.isArray(sourceValue)) {
          for (var i = 0; i < sourceValue.length; i += 1) {
            if (it.fields && it.fields.length > 0) {
              if (!destinationValue[i]) {
                createMapping(it.fields, name + '_' + it.key, {});
                destinationValue[i] = createObject({}, it.fields, true);
              }
              mapper.map(name + '_' + it.key, 'dto', sourceValue[i], destinationValue[i]);
            } else {
              destinationValue[i] = sourceValue[i];
            }
          }
        } else {
          destinationValue.length = 0;
        }
      });
      break;
    case 'SimpleModel':
    case 'reference':
    case 'object':
      createMapping(it.fields, name + '_' + it.key);
      dtom.forMember(it.key, function () {
        let sourceValue = this.__sourceValue[it.key];
        if (sourceValue) {
          mapper.map('dto', name + '_' + it.key, sourceValue, this.__destinationValue[it.key]);
        } else {
          // 对象支持把层级拉平赋值
          //console.debug(it.key, this.__sourceValue)
          const destinationValue = this.__destinationValue[it.key];
          const sourceKeys = Object.keys(this.__sourceValue);
          // ref引用类型支持
          //debug(it.fields.map(it => it.key));
          const flatValue = {};
          //for (let key in it.fields.map(it => it.key)) {
          // if (!destinationValue.hasOwnProperty(key)) {
          //   continue;
          // }
          // 把当前级别的subkey拉平成一个子对象
          const flatKeys = sourceKeys.filter(key => key.toUpperCase().indexOf(it.key.toUpperCase()) > -1);
          flatKeys.forEach(key => {
            // 这里需要对大小写格式化
            flatValue[_camelCase(key.substr(it.key.length))] = this.__sourceValue[key];
          });
          //}
          //debug(name + '_' + it.key, '=', flatValue)
          if (it.type === 'reference') {
            // destinationValue对象结构不是定义的结构导致map时获取props不对
            const refVal = createObject({}, it.fields);
            //debug(refVal)
            mapper.map('dto', name + '_' + it.key, flatValue, refVal);
            this.__destinationValue[it.key] = refVal;
          } else {
            mapper.map('dto', name + '_' + it.key, flatValue, destinationValue);
          }
        }
      });
      mtod.forMember(it.key, function () {
        let sourceValue = this.__sourceValue[it.key];
        if (sourceValue) {
          mapper.map(name + '_' + it.key, 'dto', sourceValue, this.__destinationValue[it.key]);
          // } else {
          //   this.__destinationValue[it.key] = sourceValue;
        }
      });
      break;
    case 'string':
      [dtom, mtod].forEach(atob => atob.forMember(it.key, function () {
        if (this.__sourceValue.hasOwnProperty(it.key)) {
          this.__destinationValue[it.key] = this.__sourceValue[it.key];
          // }else{
          //   this.__destinationValue[it.key] = '';
        }
      }));
      break;
    case 'number':
      [dtom, mtod].forEach(atob => atob.forMember(it.key, function () {
        if (this.__sourceValue.hasOwnProperty(it.key)) {
          this.__destinationValue[it.key] = this.__sourceValue[it.key];
          // }else{
          //   this.__destinationValue[it.key] = 0;
        }
      }));
      break;
    case 'bool':
      [dtom, mtod].forEach(atob => atob.forMember(it.key, function () {
        if (this.__sourceValue.hasOwnProperty(it.key)) {
          this.__destinationValue[it.key] = !!this.__sourceValue[it.key];
          // }else{
          //   this.__destinationValue[it.key] = 0;
        }
      }));
      break;
    case 'date':
      [dtom, mtod].forEach(atob => atob.forMember(it.key, function () {
        if (this.__sourceValue.hasOwnProperty(it.key)) {
          if (this.__sourceValue[it.key]) {
            // 支持字符串自动转换
            if (mtod === atob) {
              this.__destinationValue[it.key] = moment(this.__sourceValue[it.key]).format();
            } else {
              this.__destinationValue[it.key] = moment(this.__sourceValue[it.key]).toDate();
            }
          } else {
            this.__destinationValue[it.key] = null;
          }
          // }else{
          //   this.__destinationValue[it.key] = 0;
        }
      }));
      break;
    default:
      [dtom, mtod].forEach(atob => atob.forMember(it.key, function () {
        if (this.__sourceValue.hasOwnProperty(it.key)) {
          this.__destinationValue[it.key] = this.__sourceValue[it.key];
          // }else{
          //   this.__destinationValue[it.key] = null;
        }
      }));
    }
  });
}

export function maptoVM(key, dto, vm) {
  mapper.map('dto', key, dto, vm);
}

export function maptoDto(key, vm, dto) {
  mapper.map(key, 'dto', vm, dto);
}

const getFieldMapings = exports.getFieldMapings = (fields = [], defFields = []) => {
  return fields.reduce((maps, it) => {
    if (it.type === 'object') {
      const ret = getFieldMapings(it.fields, defFields[it.key] || []);
      if (_keys(ret).length > 0) {
        maps[it.key] = ret;
      }
    } else if (it.subtype === 'object') {
      const ret = getFieldMapings(it.fields, defFields[it.key] || []);
      if (_keys(ret).length > 0) {
        maps[it.key] = [ret];
      }
    } else if (it.mapping) {
      maps[it.mapping] = it.key;
    } else if (defFields.some(dit => dit.key === it.key)) {
      // 如果没有设置mapping字段，自动按照名称匹配
      const exists = defFields.find(dit => dit.key === it.key);
      if (it.type !== undefined && exists.type !== it.type) {
        console.debug(it)
        //throw new Error(t('{{key}}字段类型冲突，必须是{{type}}类型', exists));
      }
      maps[it.key] = it.key;
    }
    return maps;
  }, {});
}

export function readonlyDeep(target, key, initValue, enumerable = false) {
  // 修改函数的name需要先改成writable
  Object.defineProperty(target, key, {
    writable: true
  });
  if (initValue !== undefined) {
    target[key] = _isPlainObject(initValue) ? _keys(initValue).reduce((obj, key) => {
      readonlyDeep(obj, key, initValue[key], enumerable);
      return obj;
    }, {}) : initValue;
  }
  Object.defineProperty(target, key, {
    writable: false,
    //enumerable: enumerable,
    configurable: false
  });
}
