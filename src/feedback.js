// 反馈api
const feedback = {};
const none = () => {};
export default feedback;
export function registerFeedback({
  // 轻信息，无操作自动消失
  message,
  // 警告
  alert,
  // 确认是否
  confirm,
  // 安全确认，需要输入安全码
  secure
}) {
  // 规范接口
  feedback.message = (content, duration = 3, type = 'success', onClose = none) => {
    if (!message) {
      console.warn('message not support!');
      return;
    }
    const dispose = message(content, duration, type, () => onClose());
    return () => dispose();
  }

  feedback.alert = (title, content, type = 'info', okText, onOk = none) => {
    if (!alert) {
      console.warn('alert not support!');
      return;
    }
    const dispose = alert(title, content, type, okText, () => onOk());
    return () => dispose();
  }

  feedback.confirm = (title, content, okText, cancelText, onOk = none, onCancel = none) => {
    if (!alert) {
      console.warn('confirm not support!');
      return;
    }
    const dispose = confirm(title, content, okText, cancelText, () => onOk(), () => onCancel());
    return () => dispose();
  }

  feedback.secure = (title, content, placeholder, okText, cancelText, onOk = none, onCancel = none) => {
    if (!alert) {
      console.warn('secure not support!');
      return;
    }
    const dispose = secure(title, content, placeholder, okText, cancelText, (txt) => onOk(txt), () => onCancel());
    return () => dispose();
  }
}
