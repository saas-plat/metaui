import {
  observable,
  computed
} from "mobx";
import {
  Action
} from './Action';
import {
  Input
} from './Input';
import {
  assignId
} from './util';

class ActionItem {
  store;
  key;

  @observable name;
  @observable textExpr;
  @observable iconExpr;
  @observable disableExpr;
  @observable visibleExpr;

  @observable onClick;

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

  constructor(store, name, text, icon, disableExpr = false, visibleExpr = true, onClick) {
    this.store = store;
    this.key = assignId('Item');
    this.name = name || this.key;
    this.textExpr = this.store.parseExpr(text);
    this.iconExpr = this.store.parseExpr(icon);
    this.disableExpr = store.parseExpr(disableExpr);
    this.visibleExpr = store.parseExpr(visibleExpr);

    this.onClick = onClick;
  }

  static create(store, obj) {
    const {
      name,
      title,
      text,
      icon,
      disable,
      visible,
      ...action
    } = obj;
    return new ActionItem(store, name, title || text, icon, disable, visible, Action.create(store, {
      name: 'goto',
      ...action
    }));
  }
}

class OptionItem {
  store;
  key;

  @observable name;
  @observable textExpr;
  @observable descriptionExpr;
  @observable tipExpr;
  @observable iconExpr;
  @observable disableExpr;
  @observable visibleExpr;

  @observable allgroups;
  @observable btns;

  @observable inputItem;

  @computed get state() {
    return this.store.state;
  }

  @computed get type() {
    return this.store.execExpr(this.typeExpr);
  }
  @computed get groups() {
    return this.allgroups.filter(it => it.visible);
  }
  @computed get text() {
    return this.store.execExpr(this.textExpr);
  }
  @computed get description() {
    return this.store.execExpr(this.descriptionExpr);
  }
  @computed get tip() {
    return this.store.execExpr(this.tipExpr);
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

  constructor(store, name, text, description, tip, icon, disableExpr = false, visibleExpr = true, inputItem, btns = [], groups) {
    this.store = store;
    this.key = assignId('Item');
    this.name = name || this.key;
    this.textExpr = this.store.parseExpr(text);
    this.descriptionExpr = this.store.parseExpr(description);
    this.tipExpr = this.store.parseExpr(tip);
    this.iconExpr = this.store.parseExpr(icon);
    this.disableExpr = store.parseExpr(disableExpr);
    this.visibleExpr = store.parseExpr(visibleExpr);

    this.allgroups = groups;
    this.btns = btns;
    this.inputItem = inputItem;
  }

  static create(store, obj) {
    let child;
    if (obj.child) {
      child = obj.child;
    } else {
      child = [];
    }
    if (!Array.isArray(child)) {
      child = [child];
    }
    return new OptionItem(store, obj.name, obj.title || obj.text, obj.description, obj.tip, obj.icon, obj.disable, obj.visible,
      Input.create(store, obj),
      (obj.btns || []).map(it => ActionItem.create(store, it)),
      child.filter(it => it.type === 'group' || it.type === 'list').map(it => OptionGroup.create(store, it)));
  }
}

class OptionGroup {
  store;
  key;

  @observable allgroups;
  @observable allitems;

  @observable typeExpr;
  @observable name;
  @observable textExpr;
  @observable descriptionExpr;
  @observable iconExpr;
  @observable disableExpr;
  @observable visibleExpr;

  @observable btns;

  @computed get state() {
    return this.store.state;
  }
  @computed get groups() {
    return this.allgroups.filter(it => it.visible);
  }
  @computed get items() {
    return this.allitems.filter(it => it.visible);
  }
  @computed get type() {
    return this.store.execExpr(this.typeExpr);
  }
  @computed get text() {
    return this.store.execExpr(this.textExpr);
  }
  @computed get description() {
    return this.store.execExpr(this.descriptionExpr);
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

  constructor(store, type, name, text, description, icon, disableExpr = false, visibleExpr = true, groups = [], items = [], btns = []) {
    this.store = store;
    this.key = assignId('OptionGroup');
    this.name = name || this.key;
    this.typeExpr = this.store.parseExpr(type);
    this.textExpr = this.store.parseExpr(text);
    this.descriptionExpr = this.store.parseExpr(description);
    this.iconExpr = this.store.parseExpr(icon);
    this.disableExpr = store.parseExpr(disableExpr);
    this.visibleExpr = store.parseExpr(visibleExpr);

    this.allgroups = groups;
    this.allitems = items;
    this.allbtns = btns;
  }

  static create(store, obj) {
    const items = obj.items || [];
    let btns = obj.btns || [];
    if (!Array.isArray(btns)) {
      btns = [btns];
    }
    return new OptionGroup(store, obj.type, obj.name, obj.title || obj.text, obj.description, obj.icon, obj.disable, obj.visible,
      items.filter(it => it.type === 'group' || it.type === 'list').map(it => OptionGroup.create(store, it)),
      items.filter(it => it.type !== 'group' && it.type !== 'list').map(it => OptionItem.create(store, it)),
      btns.map(it => ActionItem.create(store, it)));
  }
}

export class ListGroup {
  store;
  key;

  @observable name;
  @observable allgroups;

  @observable gutterExpr;

  @observable onBeforeChange;
  @observable onChange;
  @observable onAfterChange;

  get type() {
    return 'listgroup';
  }

  @computed get state() {
    return this.store.state;
  }

  @computed get groups() {
    return this.allgroups.filter(it => it.visible);
  }

  @computed get gutter() {
    // 24列布局
    const span = parseInt(this.store.execExpr(this.gutterExpr));
    return span !== 0 ? (span) : 16;
  }

  constructor(store, name, gutterExpr = 16, groups = [], onBeforeChange, onChange, onAfterChange) {
    //assert(store);
    this.key = assignId('ListGroup');
    this.store = store;
    this.name = name || this.key;
    this.allgroups = groups;
    this.gutterExpr = store.parseExpr(gutterExpr);

    this.onBeforeChange = onBeforeChange;
    this.onChange = onChange;
    this.onAfterChange = onAfterChange;
  }

  static create(store, object) {
    let groups, name, gutter,
      onChanging,onChange,onChanged;

    if (Array.isArray(object)) {
      groups = object;
    } else if (object.groups || object.items) {
      groups = object.groups || object.items || [];
      name = object.name;
      gutter = object.gutter;
      onChanging=object.onChanging;
      onChange=object.onChange;
      onChanged=object.onChanged;
    } else {
      groups = [object];
    }
    if (!Array.isArray(groups)) {
      groups = [groups];
    }
    return new ListGroup(store, name, gutter, groups.map(it => OptionGroup.create(store, it)),
      Action.create(store, onChanging), Action.create(store, onChange), Action.create(store, onChanged));
  }
}
