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

export class Tree {
  store;
  key;

  @observable onLoading;
  @observable onLoad;
  @observable onLoaded;

  get type() {
    return 'tree';
  }

  @computed get state() {
    return this.store.state;
  }

  constructor(store, name, onLoading, onLoad, onLoaded) {
    //assert(store);

    this.key = assignId();
    this.store = store;
    this.name = name || 'Tree' + this.key;

    this.onLoading = onLoading;
    this.onLoad = onLoad;
    this.onLoaded = onLoaded;
  }

  static create(store, object = []) {
    let name, onLoading, onLoad, onLoaded;

    name = object.name;
    onLoading = object.onLoading;
    onLoad = object.onLoad;
    onLoaded = object.onLoaded;

    return new Tree(store, name,
      Action.create(store, onLoading), Action.create(store, onLoad), Action.create(store, onLoaded));
  }
}

export class Table {
  store;
  key;

  @observable onLoading;
  @observable onLoad;
  @observable onLoaded;

  get type() {
    return 'table';
  }

  @computed get state() {
    return this.store.state;
  }

  constructor(store, name, onLoading, onLoad, onLoaded) {
    //assert(store);

    this.key = assignId();
    this.store = store;
    this.name = name || 'Table' + this.key;

    this.onLoading = onLoading;
    this.onLoad = onLoad;
    this.onLoaded = onLoaded;
  }

  static create(store, object = []) {
    let name, onLoading, onLoad, onLoaded;

    name = object.name;
    onLoading = object.onLoading;
    onLoad = object.onLoad;
    onLoaded = object.onLoaded;

    return new Table(store, name,
      Action.create(store, onLoading), Action.create(store, onLoad), Action.create(store, onLoaded));
  }
}
