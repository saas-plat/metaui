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
  secure,
  // 提醒，不阻塞操作
  notification,
  // 加载
  loading,
  // 阻塞等待, 不能任何操作
  blocking
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

  feedback.secure = (title, placeholder, okText, cancelText, onOk = none, onCancel = none) => {
    if (!alert) {
      console.warn('secure not support!');
      return;
    }
    const dispose = secure(title, placeholder, okText, cancelText, (txt) => onOk(txt), () => onCancel());
    return () => dispose();
  }

  feedback.notification = (title, content, duration = 3, onClose = none, btns = [], onClick = none) => {
    if (!alert) {
      console.warn('notification not support!');
      return;
    }
    const dispose = notification(title, content, duration, btns.map(({
      text,
      key,
      type
    }) => ({
      text,
      key,
      type
    })), () => onClose(), (key) => onClick(key));
    return () => dispose();
  }

  feedback.loading = (content, duration = -1, onClose = none) => {
    const dispose = loading(content, duration, () => onClose());
    return () => dispose();
  }

  feedback.blocking = (content, duration = -1, onClose = none) => {
    const dispose = blocking(content, duration, () => onClose());
    return () => dispose();
  }
}
