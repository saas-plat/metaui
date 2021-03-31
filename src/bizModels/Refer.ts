import { BizModel } from './Base';
import { history } from '../provider';

// 表参照模型
export class Refer extends BizModel {
  protected init() {
    super.init();
    this.viewModel.on('open', this.open.bind(this));
  }

  async open() {}

  async ok() {
    history.popAndReturn(this.viewModel.gridModel.selectRows);
  }
}
