import {
  toJS,
  computed,
  action,
} from 'mobx';
import Model from './Model';
import {
  createValidator,
} from '../utils';

// 一维模型
export default class SimpleModel extends Model {

  constructor(store, props) {
    super(store, props);
  }

  @computed get createValidator() {
    return createValidator(this);
  }

  @action async validate() {
    try {
      await this.createValidator.validate({
        value: this.value
      });
      return true;
    } catch ({
      errors
    }) {
      console.debug(errors)
      this.error = errors[0].message
      return false;
    }
  }
}
