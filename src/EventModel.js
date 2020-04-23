import {
  observable
}
from 'mobx';

export default class Event {
  @observable name;
  @observable args;

  constructor(name, args) {
    this.name = name;
    this.args = args;
  }
}
