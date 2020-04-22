import {
  computed,
  runInAction,
  action,
} from 'mobx';
import {
  i18n,
  api,
  feedback
} from '@saas-plat/metaui';
import BaseStore from './BaseStore';

export default class Voucher extends BaseStore {

  @action async load(query, variables, mapping) {
    const data = await api.query(query, {
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
      const result = await api.command('SaveVoucher', data);
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
          api.portal.replace(`/${this.options.orgid}/${this.options.pid}/index/${this.options.code}`);
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