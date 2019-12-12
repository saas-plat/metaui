import {
  observable,
  computed,
  action
} from "mobx";
import {
  Button
} from './Button';
import UIStore from '../UIStore';
import UISchema from '../UISchema';
import {
  assignId
} from './util';

// 容器模型，包含一组不断递归的结构，每层有一个布局方式
export class Container {
  store;
  key;
  name;

  @observable typeExpr;
  @observable setTypeExpr;
  // 一般显示标题等信息
  @observable textExpr;
  @observable setTextExpr;
  @observable descriptionExpr;
  @observable setDescriptionExpr;
  @observable iconExpr;
  @observable setIconExpr;
  @observable disableExpr;
  @observable setDisableExpr;
  @observable visibleExpr;
  @observable setVisibleExpr;

  // 子容器或者items的布局方式
  @observable layoutExpr;
  @observable setLayoutExpr; // grid flow list
  @observable spanExpr;
  @observable setSpanExpr; // gridlayout时列数
  @observable itemWidthExpr;
  @observable setItemWidthExpr; // flowlayout每项宽度

  // 容器包含的输入项集合或子容器集合
  @observable allitems;
  // 每个容器可以包含一组按钮行为
  @observable allbtns;

  @computed get layout() {
    return this.store.execExpr(this.layoutExpr);
  }
  set layout(value) {
    if (this.setLayout) {
      return this.store.setViewModel(this.setLayout, value);
    }
    this.layoutExpr = UIStore.parseExpr(value);
  }
  @computed get setLayout() {
    return this.store.execExpr(this.setLayoutExpr);
  }
  set setLayout(setValue) {
    this.setLayoutExpr = UIStore.parseExpr(setValue);
  }
  @computed get itemWidth() {
    return parseFloat(this.store.execExpr(this.itemWidthExpr));
  }
  set itemWidth(value) {
    if (this.setItemWidth) {
      return this.store.setViewModel(this.setItemWidth, value);
    }
    this.itemWidthExpr = UIStore.parseExpr(value);
  }
  @computed get setItemWidth() {
    return this.store.execExpr(this.setItemWidthExpr);
  }
  set setItemWidth(setValue) {
    this.setItemWidthExpr = UIStore.parseExpr(setValue);
  }

  @computed get span() {
    if (this.layout === 'list') {
      return 1;
    }
    const count = parseInt(this.store.execExpr(this.spanExpr));
    return count !== 0 ? (count || 4) : count;
  }
  set span(value) {
    if (this.setSpan) {
      return this.store.setViewModel(this.setSpan, value);
    }
    this.spanExpr = UIStore.parseExpr(value);
  }
  @computed get setSpan() {
    return this.store.execExpr(this.setSpanExpr);
  }
  set setSpan(setValue) {
    this.setSpanExpr = UIStore.parseExpr(setValue);
  }
  @computed get items() {
    return this.allitems.filter(it => it.visible);
  }

  @computed get btns() {
    return this.allbtns.filter(it => it.visible);
  }

  @computed get type() {
    return this.store.execExpr(this.typeExpr);
  }
  set type(value) {
    if (this.setType) {
      return this.store.setViewModel(this.setType, value);
    }
    this.typeExpr = UIStore.parseExpr(value);
  }
  @computed get setType() {
    return this.store.execExpr(this.setTypeExpr);
  }
  set setType(setValue) {
    this.setTypeExpr = UIStore.parseExpr(setValue);
  }

  @computed get text() {
    return this.store.execExpr(this.textExpr);
  }
  set text(value) {
    if (this.setText) {
      return this.store.setViewModel(this.setText, value);
    }
    this.textExpr = UIStore.parseExpr(value);
  }
  @computed get setText() {
    return this.store.execExpr(this.setTextExpr);
  }
  set setText(setValue) {
    this.setTextExpr = UIStore.parseExpr(setValue);
  }
  @computed get description() {
    return this.store.execExpr(this.descriptionExpr);
  }
  set description(value) {
    if (this.setDescription) {
      return this.store.setViewModel(this.setDescription, value);
    }
    this.descriptionExpr = UIStore.parseExpr(value);
  }
  @computed get setDescription() {
    return this.store.execExpr(this.setDescriptionExpr);
  }
  set setDescription(setValue) {
    this.setDescriptionExpr = UIStore.parseExpr(setValue);
  }
  @computed get icon() {
    return this.store.execExpr(this.iconExpr);
  }
  set icon(value) {
    if (this.setIcon) {
      return this.store.setViewModel(this.setIcon, value);
    }
    this.iconExpr = UIStore.parseExpr(value);
  }
  @computed get setIcon() {
    return this.store.execExpr(this.setIconExpr);
  }
  set setIcon(setValue) {
    this.setIconExpr = UIStore.parseExpr(setValue);
  }
  @computed get disable() {
    return this.store.execExpr(this.disableExpr);
  }
  set disable(value) {
    if (this.setDisable) {
      return this.store.setViewModel(this.setDisable, value);
    }
    this.disableExpr = UIStore.parseExpr(value);
  }
  @computed get setDisable() {
    return this.store.execExpr(this.setDisableExpr);
  }
  set setDisable(setValue) {
    this.setDisableExpr = UIStore.parseExpr(setValue);
  }
  @computed get visible() {
    return this.store.execExpr(this.visibleExpr);
  }
  set visible(value) {
    if (this.setVisible) {
      return this.store.setViewModel(this.setVisible, value);
    }
    this.visibleExpr = UIStore.parseExpr(value);
  }
  @computed get setVisible() {
    return this.store.execExpr(this.setVisibleExpr);
  }
  set setVisible(setValue) {
    this.setVisibleExpr = UIStore.parseExpr(setValue);
  }

  constructor(store, name, typeExpr, setTypeExpr, textExpr, setTextExpr, descriptionExpr, setDescriptionExpr,
    iconExpr, setIconExpr, disableExpr, setDisableExpr, visibleExpr, setVisibleExpr, layoutExpr, setLayoutExpr,
    spanExpr, setSpanExpr, itemWidthExpr, setItemWidthExpr, items, btns) {
    this.key = assignId('Container');
    this.store = store;
    this.name = name || this.key;
    this.typeExpr = typeExpr;
    this.setTypeExpr = setTypeExpr;
    this.textExpr = textExpr;
    this.setTextExpr = setTextExpr;
    this.descriptionExpr = descriptionExpr;
    this.setDescriptionExpr = setDescriptionExpr;
    this.iconExpr = iconExpr;
    this.setIconExpr = setIconExpr;
    this.disableExpr = disableExpr;
    this.setDisableExpr = setDisableExpr;
    this.visibleExpr = visibleExpr;
    this.setVisibleExpr = setVisibleExpr;
    this.allitems = items;
    this.allbtns = btns;

    this.layoutExpr = layoutExpr;
    this.setLayoutExpr = setLayoutExpr;
    this.spanExpr = spanExpr;
    this.setSpanExpr = setSpanExpr;
    this.itemWidthExpr = itemWidthExpr;
    this.setItemWidthExpr = setItemWidthExpr;
  }

  @action addItem(...items) {
    this.allitems.push(...items);
  }

  @action removeItem(...names) {
    for (const name of names) {
      const reit = this.allitems.find(it => it.name === name);
      if (reit) {
        this.allitems.splice(this.allitems.indexOf(reit), 1);
      } else {
        console.warn('container items not exists!', name);
      }
    }
  }

  @action clearItems() {
    this.allitems.clear();
  }

  @action addButton(...items) {
    this.allbtns.push(...items);
  }

  @action removeButton(...names) {
    for (const name of names) {
      const reit = this.allbtns.find(it => it.name === name);
      if (reit) {
        this.allbtns.splice(this.allbtns.indexOf(reit), 1);
      } else {
        console.warn('sub container not exists!', name);
      }
    }
  }

  @action clearButtons() {
    this.allbtns.clear();
  }

  static createSchema(config) {
    console.log('parse %s container...', config.name || config.type)
    return new UISchema(Container,
      config.name,
      UIStore.parseExpr(config.type), UIStore.parseExpr(config.setType),
      UIStore.parseExpr(config.title || config.text), UIStore.parseExpr(config.setTitle),
      UIStore.parseExpr(config.description), UIStore.parseExpr(config.setDescription),
      UIStore.parseExpr(config.icon), UIStore.parseExpr(config.setIcon),
      UIStore.parseExpr(config.disable || false), UIStore.parseExpr(config.setDisable),
      UIStore.parseExpr(config.visible || true), UIStore.parseExpr(config.setVisible),
      UIStore.parseExpr(config.layout || 'flow'), UIStore.parseExpr(config.setLayout),
      UIStore.parseExpr(config.span), UIStore.parseExpr(config.setSpan),
      UIStore.parseExpr(config.itemWidth || 'auto'), UIStore.parseExpr(config.setItemWidth),
      (config.items || []).map(it => UIStore.createSchema(it)),
      (config.btns || []).map(it => Button.createSchema(it))
    );
  }
}
