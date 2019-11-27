export class Filter {
  store;
  key;

  name;

  constructor(store, name) {
    this.key = assignId('Filter');
    this.store = store;
    this.name = name || this.key;
  }

  static createSchema() {
    console.log('create filter...')
    return {
      type: Filter,
      args: []
    }
  }
}
