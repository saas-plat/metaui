import React from 'react';

export const fieldComponents = {

};

export function registerField(type: string, component: React.FC | React.ComponentClass) {
  fieldComponents[type] = component;
}

export function registerFields(components: {[type: string] : React.FC | React.ComponentClass}) {
  Object.keys(components).forEach(type=>{
    fieldComponents[type] = components[type];
  })
}

// 注册装饰器
export function fieldComponent(type: string) {
  return function (component: React.FC | React.ComponentClass) {
    registerField(type, component);
  };
}