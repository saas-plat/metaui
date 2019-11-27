import {
  observable,
  computed
} from "mobx";
import {
  assignId
} from './util';
import {
  Action
} from './Action';

// 行为按钮模型，可以表示按钮或者菜单等能触发action的对象
export class Button {
  store;
  key;
  name;

  @observable textExpr;
  @observable iconExpr;
  @observable disableExpr;
  @observable visibleExpr;
  @observable onClick;
  @observable typeExpr;
  // 按钮也支持子按钮集合
  @observable allitems;

  @computed get items() {
    return this.allitems.filter(it => it.visible);
  }

  @computed get type() {
    return this.store.execExpr(this.typeExpr);
  }
  set type(typeExpr) {
    this.typeExpr = this.store.parseExpr(typeExpr);
  }

  @computed get disable() {
    return this.store.execExpr(this.disableExpr);
  }
  @computed get visible() {
    return this.store.execExpr(this.visibleExpr);
  }

  @computed get text() {
    return this.store.execExpr(this.textExpr);
  }
  set text(textExpr) {
    this.textExpr = this.store.parseExpr(textExpr);
  }
  @computed get icon() {
    return this.store.execExpr(this.iconExpr);
  }
  set icon(iconExpr) {
    this.iconExpr = this.store.parseExpr(iconExpr);
  }

  constructor(store, name, type, text, icon, disableExpr = false, visibleExpr = true, onClick, items = []) {
    this.key = assignId('Button');
    this.store = store;
    this.name = name || this.key;
    this.typeExpr = this.store.parseExpr(type);
    this.textExpr = this.store.parseExpr(text);
    this.iconExpr = this.store.parseExpr(icon);
    this.disableExpr = store.parseExpr(disableExpr);
    this.visibleExpr = store.parseExpr(visibleExpr);
    this.onClick = onClick;
    this.allitems = items;
  }

  static createSchema(obj) {
    console.log('create %s button item...', obj.name)
    return {
      type: Button,
      args: [obj.name, obj.type || 'button', obj.text, obj.icon, obj.disable, obj.visible,
        Action.createSchema(obj.onClick), obj.items && obj.items.map(it => Button.createSchema(it))
      ]
    };
  }
}
