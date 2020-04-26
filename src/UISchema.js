import _mapValues from 'lodash/mapValues';
import _isArray from 'lodash/isArray';
import _mapKeys from 'lodash/mapKeys';
import _trimStart from 'lodash/trimStart';
import _isString from 'lodash/isString';
import _isPlainObject from 'lodash/isPlainObject';
import jxon from 'jxon';
// const Ajv = require('ajv');
import MetaUI from './MetaUI';

const loadReduce = ({
  type,
  bind,
  items,
  ...props
}, modelSchema = {}) => {
  if (!type) {
    console.log('not support node', props);
    return null;
  }
  // debug('parse', type);
  // 需要把bind字段视图状态字段生成出来
  if (bind) {
    const subSchema = modelSchema[bind];
    if (!subSchema) {
      console.log('bind %s not found!', bind);
      bind = null;
    }
  }
  // onXXX 是行为定义，需要转出固定格式，
  // 要是不需要转换格式，加$onXXX
  props = _mapValues(props, (val, key) => {
    if (key.startsWith('on')) {
      if (_isString(val)) {
        return {
          type: 'SimpleModel',
          name: val,
          args: {}
        }
      } else if (_isPlainObject(val)) {
        const {
          type,
          name,
          args,
          ...other
        } = val;
        return {
          type: type || 'SimpleModel',
          name,
          args: {
            ...other,
            ...args
          }
        }
      }
    } else {
      return val;
    }
  })

  // $是不转换标识，需要过滤掉
  props = _mapKeys(props, (v, key) => _trimStart(key, '$'));

  return {
    type,
    bind,
    ...props,
    items: items && items.map(it => loadReduce(it, modelSchema)).filter(it => it)
  }
}

export const loadJson = (template, modelSchema) => {

  // 这个功能应该放到开发社区
  // const valid = ajv.validate(require('./' + platform+'.json'), template);
  // if (!valid) {
  //   debug(ajv.errors);
  // }
  return loadReduce(template, modelSchema);
}

export const loadJxon = (strxml) => {
  if (!strxml) {
    return null;
  }
  jxon.config({
    valueKey: 'text',
    // attrKey: '$',
    attrPrefix: '',
    // lowerCaseTags: false,
    // trueIsEmpty: false,
    // autoDate: false,
    // ignorePrefixedNodes: false,
    // parseValues: false
  })
  const formatNode = (node) => {
    if (node.parentNode && node.nodeType === 1) {
      // 节点名称是type类型
      const attr = node.ownerDocument.createAttribute('type');
      attr.value = node.nodeName;
      node.setAttributeNode(attr);
      // 所有子节点都是items数组
      node.nodeName = 'items';
    }
    if (node.hasChildNodes()) {
      for (let i = 0; i < node.childNodes.length; i++) {
        formatNode(node.childNodes.item(i));
      }
    }
    return node;
  }

  var xml = jxon.stringToXml(strxml);
  formatNode(xml.documentElement);
  return jxon.xmlToJs(xml).items;
}

export default class UISchema {
  model;
  bind;
  props;

  constructor(model, bind, props) {
    this.model = model;
    this.bind = bind;
    this.props = props;
  }

  static createSchema(obj) {
    let {
      // key, //  系统关键字排除
      // store, //  系统关键字
      type,
      bind,
      ...props
    } = obj;

    if (!type) {
      return obj;
    }

    const Model = MetaUI.models.get(type);
    if (!Model) {
      throw new Error(`"${type}" ui model not found!`);
    }

    props = _mapValues(props, v => {
      if (_isArray(v)) {
        return v.map(UISchema.createSchema);
      } else if (v) {
        return UISchema.createSchema(v);
      } else {
        return v;
      }
    });

    return new UISchema(Model, bind, {
      type,
      ...props
    });
  }
}
