import Model from './Model';

// 二维模型
export default class ListModel extends Model {

  constructor(store, {
    data = [],
    ...props
  }) {
    super(store, {
      data,
      ...props
    });
  }
}
