import Model from './Model';
import UISchema from '../UISchema';

// 一维模型
export default class SimpleModel extends Model {

  static parseProps({
    value = null,
    ...props
  }) {
    return UISchema.parseProps({
      value,
      ...props
    });
  }

}
