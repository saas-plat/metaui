export default class UIStore {

  static components = new Map();
  static models = new Map();

  // 组件是由扩展注册的，模型是统一的，交互可以是各端不同的
  static register(...items) {
    const registerOne = (type, Component, Model) => {
      if (!type) {
        console.error('ui type not be null!', type);
        return false;
      }
      if (!Component || !Model) {
        console.error('component model not be null!', type);
        return false;
      }
      if (UIStore.components.has(type.toLowerCase())) {
        console.error('component type has registerd!', type.toLowerCase());
        return false;
      }
      UIStore.components.set(type.toLowerCase(), Component);
      UIStore.models.set(type.toLowerCase(), Model);
      return true;
    }
    if (typeof items[0] === 'string') {
      return registerOne(...items);
    } else if (typeof items[0] === 'object') {
      const keys = Object.keys(items[0]);
      let hasFaield = false;
      for (const key of keys) {
        const it = items[0][key];
        if (Array.isArray(it)) {
          if (!registerOne(key, it[0], it[1])) {
            hasFaield = true;
          }
        } else {
          if (!registerOne(key, it.component, it.model)) {
            hasFaield = true;
          }
        }
      }
      return hasFaield;
    } else {
      let hasFaield = false;
      for (const it of items) {
        if (!registerOne(it.type || it.name, it.component, it.model)) {
          hasFaield = true;
        }
      }
      return hasFaield;
    }
  }

}
