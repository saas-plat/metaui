import _keys from 'lodash/keys';
import _isUndefined from 'lodash/isUndefined';
import _isPlainObject from 'lodash/isPlainObject';
import _assign from 'lodash/assign';
import _omitBy from 'lodash/omitBy';
import _isArray from 'lodash/isArray';
import i18n from '../i18n';

const types = ["string", "object", "boolean", "array", "number", "expression", "date", 'reference'];

const isViewModelType = (type) => {
  return type && type.endsWith('Model');
}

const loadField = (it) => {
  let type;
  let subtype;
  let fields;
  let defValue;
  let src;
  let rules;
  let mapping;
  let description;
  if (typeof it === 'string') {
    type = types.indexOf(it) || isViewModelType(type) > -1 ? it : 'reference';
    if (type === 'reference' && it !== type) {
      src = it;
    }
  } else if ('type' in it || _keys(it).some(key => key.startsWith('_') || key.startsWith('$'))) {
    let {
      //type,
      //fields,
      defaultValue,
      value,
      //defValue,
      //default,
      // 系统字段以$和_开头
      $type,
      $subtype,
      $fields,
      $defValue,
      $default,
      $defaultValue,
      $value,
      $src,
      $rules,
      $mapping,
      $description,
      _type = $type,
      _subtype = $subtype,
      _fields = $fields,
      _defValue = $defValue,
      _default = $default,
      _defaultValue = $defaultValue,
      _value = $value,
      _src = $src,
      _rules = $rules,
      _mapping = $mapping,
      _description = $description,
      ...other
    } = it;
    type = _type || it.type || 'string';
    type = type === 'ref' ? 'reference' : type;
    type = type === 'expr' ? 'expression' : type;
    type = type === 'obj' ? 'object' : type;
    type = types.indexOf(type) > -1 || isViewModelType(type) ? type : 'reference';
    if (type === 'reference' && it.type !== type) {
      src = it.type;
    }
    fields = _fields || it.fields;
    fields = type === 'object' || type === 'array' || isViewModelType(type) ? loadFields(fields, types) : undefined;
    subtype = _subtype || it.subtype;
    subtype = subtype === 'ref' ? 'reference' : subtype;
    subtype = subtype === 'obj' ? 'object' : subtype;
    subtype = subtype ? (types.indexOf(subtype) > -1 || isViewModelType(subtype) ? subtype : 'reference') : subtype;
    if (subtype === 'reference' && it.subtype !== subtype) {
      src = it.subtype;
    }
    // 注意false和0的情况
    defValue = [_defValue, _default, _defaultValue, _value, it['default'], it.defValue, defaultValue, value].find(v => !_isUndefined(v));
    src = _src || it.src || src;
    description = _description || it.description;
    delete other.type;
    delete other.subtype;
    delete other['default'];
    delete other.defValue;
    delete other.value;
    delete other.mapping;
    delete other.src;
    delete other.rules;
    delete other.description;
    // rules = _rules || it.rules || {
    //   type,
    //   ...other
    // };
    // 映射字段名称，比如模型的必要字段可以映射改名
    mapping = _mapping || it.mapping;
  } else if (Array.isArray(it)) {
    type = 'array';
    let sub;
    if (it.length > 0) {
      sub = loadField(it[0], types);
      if (!sub) {
        sub = {
          type: 'object',
          fields: loadFields(it[0])
        };
      }
    } else {
      sub = {
        type: 'object',
        fields: loadFields(it.fields)
      };
    }
    subtype = sub.type;
    fields = sub.fields;
    src = sub.src;
    rules = sub.rules;
  } else if (typeof it === 'object') {
    type = 'object';
    fields = loadFields(it);
  } else {
    return null;
  }
  return {
    type,
    subtype, // 数组的元素对象类型
    fields,
    default: defValue,
    src, // 引用类型对象
    //rules, // 校验规则
    mapping,
    description, // 描述信息
  };
}
const loadFields = exports.loadFields = (obj) => {
  const fields = [];
  _isPlainObject(obj) && _keys(obj).forEach(key => {
    // 不允许$和_开头的key，系统字段
    if (key.startsWith('$') || key.startsWith('_')) {
      console.log(key + ' skip!!');
      return;
    }
    const field = loadField(obj[key]);
    if (!field) {
      console.warn('not support %s type', key);
    }
    fields.push({
      key,
      ...field
    });
  });
  return fields;
}
const getFieldMapings = (fields = [], defFields = []) => {
  return fields.reduce((maps, it) => {
    if (it.type === 'object' || isViewModelType(it.type)) {
      const ret = getFieldMapings(it.fields, defFields[it.key] || []);
      if (_keys(ret).length > 0) {
        maps[it.key] = ret;
      }
    } else if (it.subtype === 'object' || isViewModelType(it.subtype)) {
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
        //debug(it)
        throw new Error(t('{{key}}字段类型冲突，必须是{{type}}类型', exists));
      }
      maps[it.key] = it.key;
    }
    return maps;
  }, {});
}

const checkKeys = ['type', 'subtype', 'value'];

const checkRequiredFieldMap = (fields, mappings, mapFields) => {
  const errFields = [];
  const defectFields = [];
  fields.forEach(it => {
    // 不在mapping里自动补充
    if (it.type === 'object' || it.subtype === 'object' || isViewModelType(it.type) || isViewModelType(it.subtype)) {
      const rfm = checkRequiredFieldMap(it.fields || [], mappings[it.key] || {}, mapFields.find(it => it.key === mappings[it.key]));
      defectFields.push({
        ...it,
        fields: rfm.defectFields
      });
      if (rfm.errFields.length > 0) {
        errFields.push({
          ...it,
          fields: rfm.errFields
        });
      }
    } else if (it.key in mappings) {
      // WHY 这里不创建pkey下面find不好使??
      const pkey = mappings[it.key];
      const pFields = mapFields.find(it => it.key === pkey);
      const nKey = _keys(it).find(key => {
        if (checkKeys.indexOf(key) === -1) {
          return false;
        }
        if (!_isUndefined(it[key]) && pFields[key] !== it[key]) {
          return true;
        }
      });
      if (nKey) {
        //  检查mapping是否包含比配置信息，比如默认值，subtype等
        if (!_isUndefined(pFields[nKey])) {
          console.log('conflict %s: %s != %s', nKey, pFields[nKey], it[nKey]);
          errFields.push(it);
        } else {
          defectFields.push({
            ...it,
            key: pkey
          });
        }
      }
    } else if (it.type === 'reference' || it.subtype === 'reference') {
      if (it.src) {
        defectFields.push(it);
      } else {
        console.log('defect %s src', it.key);
        // 引用类型无法自动补充
        errFields.push(it);
      }
    } else {
      defectFields.push(it);
    }
  });
  return {
    defectFields,
    errFields
  };
}

const getKeyPaths = (fields = [], pname = '') => {
  return fields.reduce((paths, it) => {
    const key = [pname, it.key].filter(it => it).join('.');
    if (it.type === 'object' || isViewModelType(it.type)) {
      return paths.concat(...getKeyPaths(it.fields, it.key));
    } else if (it.subtype === 'object' || isViewModelType(it.subtype)) {
      return paths.concat(...getKeyPaths(it.fields, it.key));
    }
    return paths.concat(key);
  }, []);
}

const unionFields = (...fieldsList) => {
  return fieldsList.reduce((ret, fields) => {
    for (const it of fields) {
      const exists = ret.find(rit => rit.key === it.key);
      if (!exists) {
        ret.push(it);
        continue;
      }
      if (exists.type === 'object' || isViewModelType(exists.type)) {
        //debug(it,exists)
        exists.fields = unionFields(exists.fields || [], it.fields || []);
        // } else if (exists.subtype === 'object') {
        //   exists.fields = unionFields(exists.fields, it.fields);
      } else {
        _assign(exists, _omitBy(it, _isUndefined));
      }
    }
    return ret;
  }, []);
}

const addMappingSchemas = (fields, mappings) => {
  _keys(mappings).forEach(mkey => {
    const userkey = mappings[mkey];
    if (typeof userkey === 'string') {
      // 不需要映射
      if (userkey === mkey) {
        return;
      }
    } else if (_isArray(userkey)) {
      const submapping = userkey[0];
      addMappingSchemas(fields.find(it => it.key === mkey).fields, submapping);
    } else if (_isPlainObject(userkey)) {
      addMappingSchemas(fields.find(it => it.key === mkey).fields, userkey);
    }
    fields.push({
      key: mkey,
      type: 'mapping',
      mapping: userkey
    })
  });
}

const toJson = (fields) => {
  if (!fields) {
    return;
  }
  return fields.reduce((obj, it) => {
    const {
      key,
      fields,
      ...other
    } = it;
    obj[key] = _omitBy({
      ...other,
      fields: toJson(it.fields),
    }, _isUndefined);
    return obj;
  }, {});
}

 export const loadJson = (template, defaultTpl = {}) => {
  const defFields = loadFields(defaultTpl);
  if (template) {
    let customFields = loadFields(template);
    const mappings = getFieldMapings(customFields, defFields);
    // 检查是否有字段缺失
    const {
      defectFields,
      errFields
    } = checkRequiredFieldMap(defFields, mappings, customFields);
    if (errFields.length > 0) {
      //debug(customFields)
      throw new Error(i18n.t('视图模型缺少必要字段{{fields}}，或者{{checkKeys}}字段配置信息冲突', {
        fields: getKeyPaths(errFields).join(','),
        checkKeys: checkKeys.join(',')
      }));
    }
    // 缺失字段要是能补全自动补充
    if (defectFields.length > 0) {
      customFields = unionFields(customFields, defectFields);
    }
    addMappingSchemas(customFields, mappings);
    return toJson(customFields);
  }
  return toJson(defFields);
}
