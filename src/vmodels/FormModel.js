import {
  computed,
  runInAction,
  action,
} from 'mobx';
import {
  command,
  query,
  i18n,
  portal
} from '@saas-plat/metaapi';
import feedback from '../feedback';
import BizModel from './BizModel';

export default class FormModel extends BizModel {

  @action async load(qs, variables, mapping) {
    const data = await query(qs, {
      ...variables,
      ...this.options,
    });
    const mdata = await mapping(data);
    this.voucher.set(mdata);
  }

  @action async save(data, {
    showLoading,
    loadingText,
    showTip = true,
    hideError = false,
  }) {
    if (await this.voucher.validate()) {
      let hideLoading;
      if (showLoading) {
        hideLoading = feedback.loading(loadingText || i18n.t('保存单据中...'));
      }
      if (!data.code) {
        if (!hideError) {
          feedback.message(i18n.t('单据编号不能为空，保存失败!'), 1, 'error');
        }
        return;
      }
      const result = await command('SaveVoucher', data);
      await runInAction(async () => {
        if (!result || result.errno > 0) {
          if (!hideError) {
            feedback.message((result && result.errmsg) || i18n.t('保存失败!'), 1, 'error');
          }
          return false;
        }
        this.options.code = data.code;
        if (showTip) {
          feedback.message(i18n.t('单据保存成功!'), 3, 'success');
        }
        if (this.voucher.state === 'NEW') {
          portal.replace(`/${this.options.orgid}/${this.options.pid}/index/${this.options.code}`);
        }
      });
      if (hideLoading) {
        hideLoading();
      }
    }
  }

  @action async commit() {

  }

  // 弃审
  @action async abandoning() {

  }

  // 变更修改
  @action async update() {

  }

  @action async delete() {

  }
}
