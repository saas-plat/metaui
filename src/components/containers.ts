import React from 'react';

export const containerComponents = {

};

export function registerContainer(type: string, component: React.FC | React.ComponentClass) {
    containerComponents[type] = component;
}

export function registerContainers(components: { [type: string]: React.FC | React.ComponentClass }) {
    Object.keys(components).forEach(type => {
        containerComponents[type] = components[type];
    })
}

// 注册装饰器
export function containerComponent(type: string) {
    return function (component: React.FC | React.ComponentClass) {
        registerContainer(type, component);
    };
}