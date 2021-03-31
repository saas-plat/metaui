import { BizModel } from './Base';
import { ModeStatus } from '../models';

// 卡片模型
export class Card extends BizModel {
  async open({ id, ...params }) {
    super.open({ id, ...params });
    if (id) {
      // 编辑
      await this.edit({ id });
    } else {
      // 新增
      await this.create();
    }
  }

  async create() {
    await this.viewModel.clear(true);
    await this.viewModel.setMode(ModeStatus.Add);
    await this.viewModel.setReadOnly(false);
    await this.viewModel.setDisabled(false);
  }

  async edit({ id }) {
    if (id) {
      await this.load(id);
    }
    await this.viewModel.setMode(ModeStatus.Edit);
    await this.viewModel.setReadOnly(false);
    await this.viewModel.setDisabled(false);
  }

  async load({ id }) {
    const res = await this.invoke.load(id);
    await this.viewModel.loadData(res.data);
  }

  async save() {
    const res = await this.invoke.save(this.viewModel.collectData());
    await this.viewModel.loadData(res.data.data);
  }

  async delete() {
    await this.invoke.delete(this.viewModel.get('id').value);
    await  this.viewModel.clear();
  }
}
