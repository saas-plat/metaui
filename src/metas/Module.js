const _ = require('lodash');
const {
  loadTemplate
} = require('./Template');
const {
  loadEntity
} = require('./Entity');
const {
  loadFilter
} = require('./Filter');
const {
  loadGroup
} = require('./Group');
const {
  loadSolution
} = require('./Solution');
const {
  loadCommand
} = require('./Command');
const {
  loadAction
} = require('./Action');
const {
  loadRule
} = require('./Rule');
const debug = require('debug')('saas-plat:metes');

exports.loadModule = ({
  name,
  templates = {},
  entities = {},
  actions = {},
  filters = {},
  groups = {},
  solutions = {},
  commands = {},
  rules = {}
}) => {
  debug('load module', name);
  commands = _.mapValues(commands, loadCommand);
  // 界面布局模板
  templates = _.mapValues(templates, loadTemplate);
  // 数据实体
  entities = _.mapValues(entities, (it) => loadEntity(it, templates));
  // 功能按钮
  actions = _.mapValues(actions, (it) => loadAction(it, templates, commands));
  // 过滤条件
  filters = _.mapValues(filters, loadFilter);
  groups = _.mapValues(groups, loadGroup);
  solutions = _.mapValues(solutions, (it) => loadSolution(it, filters, groups));
  // 数据规则，例如计算规则（公式）、校验规则
  rules = _.mapValues(rules, (it) => loadRule(it, entities, filters, groups));
  return {
    name,
    templates,
    entities,
    actions,
    solutions,
    filters,
    groups,
    commands,
    rules
  }
}
