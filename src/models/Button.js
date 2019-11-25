import {
  observable,
  computed
} from "mobx";
import {
  Action
} from './Action';
import {assignId} from './util';

export class Button {
  store;
  key;

  @observable name;
  @observable textExpr;
  @observable iconExpr;
  @observable disableExpr;
  @observable visibleExpr;
  @observable onClick ;

  get type(){
    return 'button';
  }

  @computed get text() {
    return this.store.execExpr(this.textExpr);
  }
  @computed get icon() {
    return this.store.execExpr(this.iconExpr);
  }
  @computed get disable() {
    return this.store.execExpr(this.disableExpr);
  }
  @computed get visible() {
    return this.store.execExpr(this.visibleExpr);
  }


  constructor(store, name, textExpr, iconExpr, disableExpr = false, visibleExpr = true, onClick) {
     this.key = assignId();
    this.store = store;
    this.name = name || 'Button' + this.key;
    this.text = store.parseExpr(textExpr);
    this.iconExpr = store.parseExpr(iconExpr);
    this.disableExpr = store.parseExpr(disableExpr);
    this.visibleExpr = store.parseExpr(visibleExpr);
    this.onClick = onClick;
  }

  static create(store, object) {
    return new Button(store, object.name, object.text, object.disable, object.visible, Action.create(store,object.onClick));
  }
}
