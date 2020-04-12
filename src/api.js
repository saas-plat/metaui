// saas-plat平台接口能力可以到社区单据服务板块反馈
// https://community.saas-plat.com/category/8/%E8%A7%86%E5%9B%BE%E6%A8%A1%E5%9E%8B

// 命令接口,负责发送服务器端命令
let command,
  // gql查询接口,负责查询数据
  query,
  // 门户接口,负责模块间和系统间页面控制
  portal,
  // 权限接口
  permission,
  // 用户接口
  user,
  // 页面参数接口
  url;

// 接口文档可以到开发者社区查看
// https://dev.saas-plat.com/help/api/metaview
export default {
  get command() {
    if (!command) {
      console.warn('command not support!');
      return null;
    }
    return command;
  },
  get query() {
    if (!query) {
      console.warn('query not support!');
      return null;
    }
    return query;
  },
  get portal() {
    if (!portal) {
      console.warn('portal not support!');
      return null;
    }
    return portal;
  },
  get permission() {
    if (!permission) {
      console.warn('permission not support!');
      return null;
    }
    return permission;
  },
  get user() {
    if (!user) {
      console.warn('user not support!');
      return null;
    }
    return user;
  },
  get url() {
    if (!url) {
      console.warn('url not support!');
      return null;
    }
    return url;
  }
};

// 注册运行环境api
export function registerApi(provider) {
  if ('command' in provider) {
    command = provider.command;
  }
  if ('query' in provider) {
    query = provider.query;
  }
  if ('portal' in provider) {
    portal = provider.portal;
  }
  if ('permission' in provider) {
    permission = provider.permission;
  }
  if ('user' in provider) {
    user = provider.user;
  }
  if ('url' in provider) {
    url = provider.url;
  }
}
