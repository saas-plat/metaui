import React from 'react';
import PropTypes from 'prop-types';
import {
  Inflectors
} from "en-inflectors";
import {
  none
}
from '../utils';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';

// 组件容器，渲染子组件提供统一的上下文环境
export default class UIContainer extends React.Component {
  static propTypes = {
    context: PropTypes.object,
    onEvent: PropTypes.func,
    onAction: PropTypes.func, // action 和 event是有区别的，action是event配置的默认行为，就算不配置也可以有view的默认行为
    children: PropTypes.node,
  }

  static defaultProps = {
    onAction: none,
    onEvent: none,
  }

  static childContextTypes = {
    onEvent: PropTypes.func,
  }

  handleEvent = (target, evtName, args, defaultAction = null) => {
    const key = target.name,
      before = new Inflectors(evtName).toGerund(),
      doing = new Inflectors(evtName).toPresent(),
      after = new Inflectors(evtName).toPast(),
      beforeEvent = key + '.' + before,
      event = key + '.' + doing,
      afterEvent = key + '.' + after,
      beforeTitleCase = before[0].toUpperCase() + before.substr(1),
      titleCase = doing[0].toUpperCase() + doing.substr(1),
      afterTitleCase = after[0].toUpperCase() + after.substr(1),
      beforeAction = target['on' + beforeTitleCase],
      action = target['on' + titleCase] || defaultAction,
      afterAction = target['on' + afterTitleCase];
    if (!key) {
      console.warn('target key not exists, skip handle event.');
      return;
    }
    this.execute({
      beforeEvent,
      event,
      afterEvent
    }, {
      beforeAction,
      action,
      afterAction
    }, {
      ...args
    });
  }

  execute(targetEvent = {}, defaultAction = {}, args = {}) {
    const tasks = [];
    typeof defaultAction.beforeAction === 'object' ?
      tasks.push(this.executeAction(defaultAction.beforeAction, args, this.props.context)) :
      typeof defaultAction.beforeAction === 'function' ?
      tasks.push(defaultAction.beforeAction(args, this.props.context)) :
      null;
    tasks.push(this.triggerEvent(targetEvent.beforeEvent, args, this.props.context));
    typeof defaultAction.action === 'object' ?
      tasks.push(this.executeAction(defaultAction.action, args, this.props.context)) :
      typeof defaultAction.action === 'function' ?
      tasks.push(defaultAction.action(args, this.props.context)) :
      null;
    tasks.push(this.triggerEvent(targetEvent.event, args, this.props.context));
    typeof defaultAction.afterAction === 'object' ?
      tasks.push(this.executeAction(defaultAction.afterAction, args, this.props.context)) :
      typeof defaultAction.afterAction === 'function' ?
      tasks.push(defaultAction.afterAction(args, this.props.context)) :
      null;
    tasks.push(this.triggerEvent(targetEvent.afterEvent, args, this.props.context));
    // todo: tasks是否需要改成执行队列，保证多个事件按照顺序执行??
    Promise.all(tasks).catch(err => {
      console.warn(err);
    });
  }

  async triggerEvent(name, args = {}, context = {}) {
    console.log('trigger event', name);
    this.props.onEvent(name, {
      ...args
    }, context);
    console.log('trigger event computed', name);
  }

  async executeAction(items, args = {}, context = {}) {
    if (!items) {
      return;
    }
    if (Array.isArray(items)) {
      for (let i = 0; i < items.length; i++) {
        await this.executeAction(items[i], args, context);
      }
    } else {
      const params = args;
      // 这里执行行为
      let actionObj;
      let action = items;
      if (typeof action === 'string') {
        actionObj = {
          ...params,
          name: action
        }
      } else {
        if (!action.name) {
          console.warn('action name not exists, can not execute');
          return;
        }
        actionObj = {
          ...action.args,
          ...params,
          name: action.name
        };
      }
      const {
        name,
        ...other
      } = actionObj;
      //try {
      console.log('execute action', name);
      this.props.onAction(name, other, context);
      console.log('execute action computed', name);
      // } catch (err) {
      //   warn(err);
      // }
    }
  }

  getChildContext() {
    return {
      onEvent: this.handleEvent,
    };
  }

  render() {
    return (<I18nextProvider i18n={i18n}>
        {this.props.children}
      </I18nextProvider>);
  }
}
