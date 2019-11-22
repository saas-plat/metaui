import React from 'react';
import PropTypes from 'prop-types';

const none = () => {}

// 组件容器，渲染子组件提供统一的上下文环境
export default class ComponentContainer extends React.Component {
  static propTypes = {
    t: PropTypes.func,
    context: PropTypes.object,
    onEvent: PropTypes.func,
    onAction: PropTypes.func, // action 和 event是有区别的，action是event配置的默认行为，就算不配置也可以有view的默认行为
    children: PropTypes.element,
  }

  static defaultProps = {
    onAction: none,
    onEvent: none,
  }

  static childContextTypes = {
    onEvent: PropTypes.func,
  }

  handleEvent = (target, event, args, defaultAction = null) => {
    const key = target.name,
      evtName = event,
      formatEvent = evtName[0].toUpperCase() + evtName.substr(1),
      eventName = key + '.' + evtName,
      beforeEvent = key + '.before' + formatEvent,
      afterEvent = key + '.after' + formatEvent,
      onevent = eventName,
      beforeAction = target['onBefore' + formatEvent],
      action = target['on' + formatEvent] || defaultAction,
      afterAction = target['onAfter' + formatEvent];
    if (!key) {
      console.warn('target key not exists, skip handle event.');
      return;
    }
    this.execute({
      beforeEvent,
      event: onevent,
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
          ...action.toJS().args,
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
      t: this.props.t
    };
  }

  render() {
    return this.props.children;
  }
}
