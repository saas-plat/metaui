import schema from 'async-validator';
import Expression from 'saas-plat-expression';

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
    return {
      ...obj,
      [dataIndex]: {
        type,
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
      }
    }
  }, {})
  //console.log(descriptor)
  return new schema(descriptor);
}
