import React from 'react';
import CacheRoute,{CacheSwitch} from 'react-router-cache-route';
import UIComponent from './UIComponent';

export default class SubView extends UIComponent {
  render() {
    const {
      items
    } = this.props.config;
    return <CacheSwitch>
        {items.map(subview =>
          <CacheRoute key={subview.key} path={`/${subview.name}/:id?`} render={()=>this.renderItem(subview)}></CacheRoute>
        )}
      </CacheSwitch>
  }
}
