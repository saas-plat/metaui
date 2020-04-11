const api = {};
export default api;
// 注册运行环境api
export function registerApi({
  // 命令接口,负责发送服务器端命令
  command,
  // gql查询接口,负责查询数据
  query,
  // 门户接口,负责模块间和系统间页面控制
  portal,
  // 权限接口
  permission,
  // 用户接口
  user,
  // 页面参数接口
  url
}) {
  api.command = async (name, data) => {
    if (!command) {
      console.warn('command not support!');
      return;
    }
    return await command(name, data);
  };
  api.query = async (querystring, variables) => {
    if (!query) {
      console.warn('query not support!');
      return;
    }
    return await query(querystring, variables);
  };
  api.portal = async (command, data) => {
    if (!portal) {
      console.warn('portal not support!');
      return;
    }
    return await portal(command, data);
  };
  api.permission = async (command, data) => {
    if (!permission) {
      console.warn('permission not support!');
      return;
    }
    return await permission(command, data);
  };
  api.user = async (name, data) => {
    if (!user) {
      console.warn('user not support!');
      return;
    }
    return await user(name, data);
  };
  api.url = async (name, data) => {
    if (!url) {
      console.warn('url not support!');
      return;
    }
    return await url(name, data);
  };
}
