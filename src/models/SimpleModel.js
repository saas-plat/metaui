import Model from './Model';

// 一维模型
export default class SimpleModel extends Model {

  constructor(store, {
    value,
    ...props
  }) {
    super(store, {
      value,
      ...props
    });
  }

}
