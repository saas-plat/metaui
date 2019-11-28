export default class UISchema{
  type;
  args;

  constructor(type, ...args){
    this.type = type;
    this.args = args;
  }
}
