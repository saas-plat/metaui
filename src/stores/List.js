import {
  computed,
  observable,
  runInAction,
  action,
} from 'mobx';
import {
  socket,
} from 'saas-plat-clientfx';
import BaseStore from './BaseStore';

export default class VoucherListStore extends BaseStore {

  @computed get vouchers (){
    return this.viewModel.vouchers;
  }
  @observable currentIndex = 0;

  // 当前单据
  @computed get voucher(){
    return this.vouchers[this.currentIndex];
  }

  @action async create() {
    const {
      orgid,
      pid
    } = this.options;
    const data = await socket.get('voucher/create', {
      orgid,
      pid
    });
    runInAction(() => {
      this.viewModel.set({
        ...data,
        state: 'NEW'
      });
      if (data.code !== undefined) {
        this.options.code = data.code;
      }
    });
  }

  @action async prev() {

  }

  @action async next() {

  }

  @action async first() {

  }

  @action async last() {

  }

  @action async load(){
    // 加载单据列表

  }
}
