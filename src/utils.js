import schema from 'async-validator';

export function t(template, data) {
  return template.replace(/\{\{([\w\.]*)\}\}/g, function (str, key) {
    var keys = key.split("."),
      v = data[keys.shift()];
    for (var i = 0, l = keys.length; i < l; i++) v = v[keys[i]];
    return (typeof v !== "undefined" && v !== null) ? v : "";
  });
}

export const none = () => {}

export const createValidator = (...fields) => {
  var descriptor = fields.reduce((obj, {
    dataIndex,
    type,
    required,
    message,
    len,
    pattern,
    whitespace,
    min,
    max,
    ...other, // enum
  }) => {
    return {
      ...obj,
      [dataIndex]: {
        type,
        required,
        message,
        len,
        pattern,
        whitespace,
        min,
        max,
        enum: other.enum
      }
    }
  }, {})
  return new schema(descriptor);
}
