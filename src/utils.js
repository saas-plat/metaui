import schema from 'async-validator';
import Expression from 'saas-plat-expression';
import _omitBy from 'lodash/omitBy';
import _isUndefined from 'lodash/isUndefined';

export function t(template, data) {
  return template.replace(/\{\{([\w\.]*)\}\}/g, function (str, key) {
    var keys = key.split("."),
      v = data[keys.shift()];
    for (var i = 0, l = keys.length; i < l; i++) v = v[keys[i]];
    return (typeof v !== "undefined" && v !== null) ? v : "";
  });
}

export const none = () => {}

export const map = (obj, mapping) => {
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
