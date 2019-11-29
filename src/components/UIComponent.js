import React from 'react';
import PropTypes from 'prop-types';
import UIRender from './UIRender';

export default class UIComponent extends React.Component{
  static propTypes = {
    config: PropTypes.object.isRequired,
  }

  static contextTypes = {
    onEvent: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  }

  state = {}

  renderItem(config){
    return <UIRender key={config.key} ui={config}/>
  }

}
