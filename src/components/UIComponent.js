import React from 'react';
import PropTypes from 'prop-types';

export default class UIComponent extends React.Component{
  static propTypes = {
    viewModel: PropTypes.object.isRequired,

  }

  static contextTypes = {
    onEvent: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  }

  state = {}

}
