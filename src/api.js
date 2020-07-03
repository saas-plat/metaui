// saas-plat平台接口能力可以到社区单据服务板块反馈
// https://community.saas-plat.com/category/8/%E8%A7%86%E5%9B%BE%E6%A8%A1%E5%9E%8B

const apis = {};

// // 命令接口,负责发送服务器端命令
// let command,
//   // gql查询接口,负责查询数据
//   query,
//   // 门户接口,负责模块间和系统间页面控制
//   portal,
//   // 权限接口
//   permission,
//   // 用户接口
//   user,
//   // 页面参数接口
//   params,
//   // 多语言接口
//   i18n;

// 接口文档可以到开发者社区查看
// https://dev.saas-plat.com/help/api/metaview
export default apis;
//{
// get command() {
//   if (!command) {
//     console.warn('command not support! forget to register API?');
//     return null;
//   }
//   return command;
// },
// get query() {
//   if (!query) {
//     console.warn('query not support! forget to register API?');
//     return null;
//   }
//   return query;
// },
// get portal() {
//   if (!portal) {
//     console.warn('portal not support! forget to register API?');
//     return null;
//   }
//   return portal;
// },
// get permission() {
//   if (!permission) {
//     console.warn('permission not support! forget to register API?');
//     return null;
//   }
//   return permission;
// },
// get user() {
//   if (!user) {
//     console.warn('user not support! forget to register API?');
//     return null;
//   }
//   return user;
// },
// get params() {
//   if (!params) {
//     console.warn('params not support! forget to register API?');
//     return null;
//   }
//   return params;
// },
// get i18n() {
//   if (!i18n) {
//     console.warn('i18n not support! forget to register API?');
//     return null;
//   }
//   return i18n;
// }
// };

// 注册运行环境api
export function registerApi(provider) {
  // if ('command' in provider) {
  //   command = provider.command;
  // }
  // if ('query' in provider) {
  //   query = provider.query;
  // }
  // if ('portal' in provider) {
  //   portal = provider.portal;
  // }
  // if ('permission' in provider) {
  //   permission = provider.permission;
  // }
  // if ('user' in provider) {
  //   user = provider.user;
  // }
  // if ('params' in provider) {
  //   params = provider.params;
  // }
  // if ('i18n' in provider) {
  //   i18n = provider.i18n;
  // }

  // 外部api改成动态注册机制，扩展性更强，平台修改了不用改框架
  Object.keys(provider).forEach(key => {
    apis[key] = provider[key];
  })
}
