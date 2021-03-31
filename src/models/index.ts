import { DataModel } from './BaseModel';
import { SimpleModel } from './SimpleModel';
import { GridModel } from './GridModel';
import { ContainerModel } from './ContainerModel';

export * from './BaseModel';
export * from './SimpleModel';
export * from './GridModel';
export * from './ContainerModel';

export const models: { [key: string]: typeof DataModel } = {
  SimpleModel,
  GridModel,
};

export function registerDataModel(name: string, Model: typeof DataModel) {
  models[name] = Model;
}
 
// 注册装饰器
export function dataModel(name: string) {
  return function (Model: typeof DataModel) {
    registerDataModel(name, Model);
  };
}
 