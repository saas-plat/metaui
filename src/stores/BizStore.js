import BaseStore from './BaseStore';

class EmptyStore extends BaseStore {

}

// 业务模型管理
export default class BizStore {

  static storeTypes = new Map();

  static getType(type) {
    const Store = this.storeTypes.get(type) || EmptyStore;
    return Store;
  }

  static create(type, viewModel) {
    const Store = this.getType(type);
    return new Store(viewModel);
  }

  static registerModel(Stores) {
    const keys = Object.keys(Stores);
    for (const name of keys) {
      if (!name) {
        console.error('store can not be register');
        return;
      }
    }
    for (const name of keys) {
      let type = name;
      // 首字母大写
      type = type[0].toUpperCase() + type.substr(1);
      this.storeTypes.set(type, Stores[name]);
    }
  }

}
