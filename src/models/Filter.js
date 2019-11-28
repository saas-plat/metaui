import {
  observable,
  computed,
  action
} from "mobx";
import {
  assignId
} from './util';
import UIStore from '../UIStore';
import UISchema from '../UISchema';

export class Filter {
  store;
  key;
  name;

  constructor(store, name) {
    this.key = assignId('Filter');
    this.store = store;
    this.name = name || this.key;
  }

  static createSchema(config) {
    console.log('parse filter...')
    return new UISchema(Filter, config.name);
  }
}
