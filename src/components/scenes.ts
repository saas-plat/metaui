import React from 'react';

export const sceneComponents = {
 
};

export function registerScene(type: string, component: React.FC | React.ComponentClass) {
  sceneComponents[type] = component;
}

export function registerScenes(components: {[type: string] : React.FC | React.ComponentClass}) {
  Object.keys(components).forEach(type=>{
    sceneComponents[type] = components[type];
  })
}

// 注册装饰器
export function sceneComponent(name: string) {
  return function (component: React.FC | React.ComponentClass) {
    registerScene(name, component);
  };
}