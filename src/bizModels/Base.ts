import { api, history } from '../provider';
import { ContainerModel } from '../models/ContainerModel';

// 所有业务模型的基类
export class BizModel {
  protected viewModel: ContainerModel;
  protected apiUrl: string;
  protected apiConfig: { [key: string]: { method: string } };
  protected invoke: {
    [key: string]: Function;
  };

  constructor(viewModel) {
    this.viewModel = viewModel;
    this.invoke = new Proxy(
      {},
      {
        get: (target, name) => async (...args) => {
          if (typeof name === 'string') {
            const apic = this.apiConfig && this.apiConfig[name];
            if (!apic) {
              throw new Error(name + ' api not exists');
            }
            const res = await api[apic.method](`/${this.apiUrl}/${name}`, ...args);
            return res.data;
          } else {
            return null;
          }
        },
      }
    );
    this.init();
  }

  protected init() {
    // 初始化
    this.viewModel.on('close', this.leave.bind(this));
    this.viewModel.on('open', this.open.bind(this));
  }

  // vm触发的行为
  async doAction(name: string, params) {
    try {
      if (typeof this[name] === 'function') {
        await this[name](params);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  // 返回上一页
  async goback() {
    this.viewModel.pageStack.pop();
  }

  // 跳转子页面
  async goto(params) {
    this.viewModel.pageStack.push(params.page || params);
  }

  async replace(params) {
    this.viewModel.pageStack[this.viewModel.pageStack.length - 1] = params.page || params;
  }

  async leave() {
    if (this.viewModel.pageStack.length > 1) {
      await this.goback();
    } else {
      // 多页面时离开第一个页面才是close
      this.close();
    }
  }

  async open(params) {
    // todo
  }

  async close() {
    history.pop(-1, true);
  }

  async openBill(params: { billType: string; billNo: string; billId?: string; [key: string]: any }) {
    const ok = await this.viewModel.execute('beforeOpenBill', params);
    if (ok) {
      history.push({
        path: `/${params.billType}/${params.billNo}`,
        data: { ...params, fromVM: this.viewModel },
        callbacks: async (returnData) => {
          await this.viewModel.execute('afterOpenBill', { ...params, returnData });
        },
      });
    }
  }
}
