import React from 'react';
import PropTypes from 'prop-types';
import UIRender from './UIRender';

export default class UIComponent extends React.Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
  }

  static contextTypes = {
    onEvent: PropTypes.func,
  }

  onEvent = (...args) => {
    if (this.context.onEvent) {
      this.context.onEvent(...args);
    }
  }

  state = {}

  renderItem(config, props={}) {
    return <UIRender key={config.key} ui={config} {...props}/>
  }

}
