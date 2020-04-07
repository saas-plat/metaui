import {
  observable,
  computed,
  action,
} from 'mobx';

// MDF业务模型基类
export default class BaseStore { 

  @observable viewModel;

  constructor(viewModel) {
    this.viewModel = viewModel;
  }

}
