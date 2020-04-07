import Model from './Model';

// 二维模型
export default class ListModel extends Model {

  constructor(store, {
    dataSource = [],
    ...props
  }) {
    super(store, {
      dataSource,
      ...props
    });
  }
}
