// UI组件的基类
export UIComponent from './components/UIComponent';
// 组件容器
export UIContainer from './components/UIContainer';
// 组件类型管理器
export UIStore from './UIStore';
// ui模型渲染器
export UIRender from './components/UIRender';
// 视图模型类型
export SimpleModel from './models/SimpleModel';
export ListModel from './models/ListModel';
export TableModel from './models/TableModel';
export TreeModel from './models/TreeModel';
export FilterModel from './models/FilterModel';
export ReferModel from './models/ReferModel';
export ContainerModel from './models/ContainerModel';
export ReportModel from './models/ReportModel';
// 通用的反馈机制
export feedback, {
  registerFeedback
}
from './feedback';
// register route
import UIStore from './stores/UIStore';
import ContainerModel from './models/ContainerModel';
import SubView from './components/SubView';
UIStore.register({
  route: [SubView, ContainerModel],
})
// 业务模型
export BaseStore from './stores/BaseStore';
export BizStore from './stores/BizStore';
export i18n from './i18n';
