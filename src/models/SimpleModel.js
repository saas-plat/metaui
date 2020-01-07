import {
  computed,
  action,
} from 'mobx';
import Model from './Model';
import {
  createValidator,
  t
} from '../utils';


// 一维模型
export default class SimpleModel extends Model {

  constructor(store, props) {
    super(store, props);
  }

  @computed get validator(){
    return createValidator(...this.columns);
  }

  @action async validate() {
    try {
      await this.validator.validate(this);
    } catch ({
      errors
    }) {
      this.error = errors[0].message || t('数据无效')
    }
  }
}
