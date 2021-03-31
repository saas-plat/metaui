import { Card } from './Card';
import { BizModel } from './Base';
import { FreeView } from './FreeView';
import { Voucher } from './Voucher';
import { VoucherList } from './VoucherList'; 
import { Refer } from './Refer';
import { TreeTableRefer } from './TreeTableRefer';

export * from './Card';
export * from './Voucher';
export * from './VoucherList';
export * from './Refer';
export * from './TreeTableRefer';

export const bizModels: { [key: string]: typeof BizModel } = {
  voucher: Voucher,
  voucherList: VoucherList,
  freeView: FreeView,
  card: Card,
  refer: Refer,
  treeTableRefer: TreeTableRefer,
  // todo add more...
};

export function registerBizModel(name: string, Model: typeof BizModel) {
  bizModels[name] = Model;
}

// 注册装饰器
export function bizModel(name: string) {
  return function (Model: typeof BizModel) {
    registerBizModel(name, Model);
  };
}
