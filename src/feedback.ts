export enum ConfirmType {
  OK = 'Ok',
  CANCEL = 'CANCEL',
}

export enum FeedbackType {
  success,
  fail,
  info,
  loading,
  alert,
  confirm,
  password,
}

let impl: (
  type: FeedbackType,
  title: string,
  content: string,
  btns: { [key: string]: string },
  onClose: (result?: ConfirmType) => void
) => () => void;

export const registerFeedback = (
  provider: (
    type: FeedbackType,
    title: string,
    content: string,
    btns: { [key: string]: string },
    onClose: (result?: ConfirmType) => void
  ) => () => void
) => {
  impl = provider;
};

// 通用的反馈形式

export const feedback = {
  success: (content: string, title?: string, onClose?) => {
    return impl(FeedbackType.success, title, content, null, onClose);
  },
  fail: (content: string, title?: string, onClose?) => {
    return impl(FeedbackType.fail, title, content, null, onClose);
  },
  loading: (content?: string, title?: string, onClose?) => {
    return impl(FeedbackType.loading, title, content, null, onClose);
  },
  info: (content: string, title?: string, onClose?) => {
    return impl(FeedbackType.info, title, content, null, onClose);
  },
  alert: (content: string, title?: string, onClose?, btns?) => {
    return impl(FeedbackType.alert, title, content, btns, onClose);
  },
  confirm: (content: string, title?: string, onClose?, btns?) => {
    return impl(FeedbackType.confirm, title, content, btns, onClose);
  },
  password: (content: string, title?: string, onClose?, btns?) => {
    return impl(FeedbackType.password, title, content, btns, onClose);
  },
};
