import schema from 'async-validator';
import Expression from '@saas-plat/expression';
import omitBy from 'lodash/omitBy';
import isArray from 'lodash/isArray';
import isUndefined from 'lodash/isUndefined';
import {
  observable,
  runInAction,
} from 'mobx';
import {
  addTypeCreator,
  createObject
} from '@saas-plat/metaschema/lib/Schema';
import SimpleModel from './models/SimpleModel';
import ListModel from './models/ListModel';
import TableModel from './models/TableModel';
import FilterModel from './models/FilterModel';
const debug = require('debug')('saas-plat:utils');

addTypeCreator('SimpleModel', (it, defineObj, {
  store
}) => {
  defineObj[it.key] = new SimpleModel(store, createObject({}, it.fields));
});
addTypeCreator('ListModel', (it, defineObj, {
  store
}) => {
  defineObj[it.key] = new ListModel(store, createObject({}, it.fields));
});
addTypeCreator('TableModel', (it, defineObj, {
  store
}) => {
  defineObj[it.key] = new TableModel(store, createObject({}, it.fields));
});
addTypeCreator('FilterModel', (it, defineObj, {
  store
}) => {
  defineObj[it.key] = new FilterModel(store, createObject({}, it.fields));
});
addTypeCreator('reference', (it, defineObj, {
  cutRef = false,
  ...opts
}) => {
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
    let props = createObject({}, it.fields, {
      cutRef,
      ...opts
    });
    // debug(defineObj,{
    //   [it.key]: props
    // },subDecs)
    defineObj[it.key] = observable.ref(props)
  }
});
addTypeCreator('expression', (it, defineObj) => {
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
});

exports.createValidator = (...fields) => {
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
    validator,
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
    let asyncValidator;
    if (typeof validator === 'function') {
      asyncValidator = function (...args) {
        debug('execute validator...', validator);
        return validator.call(this, ...args, {})
      };
    } else if (typeof validator === 'string') {
      let fn;
      if (isArray(validator)) {
        if (validator.every(it => it.indexOf('return ') === -1)) {
          fn = validator.map((it, i) => i === validator.length - 1 ? 'return ' + it : it).join('\n');
        } else {
          fn = validator.join('\n');
        }
      } else {
        if (validator.indexOf('return ') === -1) {
          fn = 'return ' + validator;
        } else {
          fn = validator;
        }
      }
      asyncValidator = function (...args) {
        debug('execute validator...', fn);
        return new Function('rule, value, source, options, scope',fn).call(this, ...args, {});
      }
    }
    return {
      ...obj,
      [dataIndex]: omitBy({
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
          return mapobj(value, transform);
        },
        asyncValidator
      }, isUndefined)
    }
  }, {})
  //console.log(descriptor)
  return new schema(descriptor);
}

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

exports.createProxy = (data, target, fields, name) => {
  const map = observable.map(data);
  // 使用代理支持动态属性，减少模型的定义
  const proxy = new Proxy(target, {
    ownKeys(target) {
      // 这里必须调用map保证观察性
      const mapkeys = [...map.keys()];
      return Object.keys(target).filter(key => mapkeys.indexOf(key) === -1).concat(mapkeys);
    },
    deleteProperty(target, key) {
      if (fields.some(it => it.key === key)) {
        delete target[key];
        return map.delete(key);
      } else if (key in target) {
        return delete target[key];
      }
      return false;
    },
    has(target, key) {
      // 这里必须调用map保证观察性
      return fields.some(it => it.key === key) || key in target;
    },
    get(target, key) {
      if (fields.some(it => it.key === key)) {
        return map.get(key);
      } else {
        // If it exist, return original member or function.
        const fn = target[key];
        const isFunction = typeof fn === "function";
        return isFunction ?
          function (...args) {
            // 不能传target，导致函数里this无法获取动态属性
            return fn.call(this, ...args);
          } : fn;
      }
    },
    set(target, key, value) {
      if (fields.some(it => it.key === key)) {
        // 这里不需要再mapto了,赋值可能已经有子对象map赋值过了
        // const vm = map.has(key) ? map.get(key) : createObject(fields);
        // // mapto中创建代理
        // maptoVM(name, value, vm);
        runInAction(() => {
          map.set(key, value);
        });
        // 要不ownKeys会过滤掉不存在的key
        target[key] = value;
        return true;
      } else if (key in target) {
        target[key] = value;
        return true;
      }
      // 不能动态添加字段
      return false;
    }
  });
  // 必须给target设置属性，要不ownKeys会过滤掉不存在的key
  Object.keys(data).forEach(key => {
    // 不能直接赋值，要不计算表达式内this.xx不是动态属性值
    // target[key] = props[key]
    Object.defineProperty(target, key, {
      configrable: true,
      enumerable: true,
      get: function () {
        return proxy[key];
      },
      set: function (val) {
        proxy[key] = val
      }
    })
  });
  return proxy;
}

const none = exports.none = () => {}

exports.noenumerable = function (target, ...keys) {
  keys.forEach(key => {
    Object.defineProperty(target, key, {
      enumerable: false,
      writable: true,
      configurable: false
    });
  })
}

exports.readonly = function readonly(target, key, initValue, enumerable = false) {
  // 修改函数的name需要先改成writable
  Object.defineProperty(target, key, {
    writable: true
  });
  if (initValue !== undefined) {
    target[key] = initValue;
  }
  Object.defineProperty(target, key, {
    writable: false,
    //enumerable: enumerable,
    configurable: false
  });
}
