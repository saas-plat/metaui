import React from 'react';
import PropTypes from 'prop-types';
import UIStore from '../UIStore';

// 模板视图，根据模板配置生成一个子视图界面
export default class UIRender extends React.Component {
  static propTypes = {
    ui: PropTypes.object.isRequired,
  }

  render() {
    const Component = UIStore.components.get(this.props.ui.type);
    if (!Component) {
      return null;
    }
    const {
      ui,
      ...other
    } = this.props;
    // 需要合并props，要不SumMenu报错
    return <Component {...other} config={ui}/>
  }
}
