import React from 'react';
import PropTypes from 'prop-types';
import UIRender from './UIRender';

export default class UIComponent extends React.Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
  }

  static contextTypes = {
    onEvent: PropTypes.func,
    t: PropTypes.func,
  }

  onEvent = (...args) => {
    if (this.context.onEvent) {
      this.context.onEvent(...args);
    }
  }

  t = (txt)=>{
    if (this.context.t){
      this.context.t(txt);
    }
    return txt;
  }

  state = {}

  renderItem(config) {
    return <UIRender key={config.key} ui={config}/>
  }

}
