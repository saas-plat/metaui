import { feedback, ConfirmType } from '../feedback';
import { history, dataStore } from '../provider';
import { Card } from './Card';
import _pick from 'lodash/pick';

// 单据模型
export class Voucher extends Card {


  async open({ id, source, ...params }) {
    if (source === 'copy') {
      // 拷贝
      const args = {
        fromBo: this.viewModel.get('bo'),
        toBo: this.viewModel.get('bo'),
        fromIds: [id],
      };
      await this.copy(args);
    } else {
      // 新增、编辑
      await super.open({ id, ...params });
      if (!id) {
        // 恢复本地缓存
        this.loadDataStore();
      }
    }
  }

  async close() {
    if (this.viewModel.isDirty) {
      feedback.confirm(
        '内容已更改',
        '内容已更改，确定要离开吗？',
        (result) => {
          if (result === ConfirmType.OK) {
            this.cleanDataStore();
            super.close();
          }
        },
        {
          CANCEL: '离开',
        }
      );
    } else {
      this.cleanDataStore();
      await super.close();
    }
  }

  async saveDataStore() {
    await dataStore.save(`${this.viewModel.get('billType')}_${this.viewModel.get('billNo')}`, this.viewModel.data);
  }

  async cleanDataStore() {
    await dataStore.save(`${this.viewModel.get('billType')}_${this.viewModel.get('billNo')}`, '');
  }

  // 恢复本地存储
  async loadDataStore() {
    const data = await dataStore.read(`${this.viewModel.get('billType')}_${this.viewModel.get('billNo')}`);
    if (data) {
      feedback.confirm(`发现未完成的其他入库单`, '您有一张正在编辑的其他入库单，是否打开？', (result) => {
        if (result === ConfirmType.CANCEL) {
          this.cleanDataStore();
          return;
        }
        this.viewModel.loadData(data, true);
      });
    }
  }



  async abandon() { }

  async copy({ fromBo, toBo, fromIds }: { fromBo: string; toBo: string; fromIds: string[] }) {
    // TODO 
  }

  async save() {
    super.save();

    //清空缓存
    this.cleanDataStore();
    if (this.viewModel.get('params').id && this.viewModel.get('params').source != 'copy') {
      history.popAndReturn({ query: { id: this.viewModel.get('id').data } }, -1, true);
    }
  }

  async pull() { }

  async push() { }

  async saveDraft() { }

  async openDraftList() { }

  async addRow() { }

  async audit() { }
  async submit() { }
  async unsubmit() { }
  async unaudit() { }

  //打印预览
  async printPreview() { }
  //打印设计
  async printDesign() { }
  //直接打印
  async printNow() { }
}
