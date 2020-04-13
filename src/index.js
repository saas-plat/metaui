// UI组件的基类
export UIComponent from './components/UIComponent';
// 组件容器
export UIContainer from './components/UIContainer';
// 组件类型管理器
export UIStore from './stores/UIStore';
export MetaStore from './stores/MetaStore';
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
// 业务模型
import MetaStore from './stores/MetaStore';
export i18n from './i18n';
export api from './api'; 
// register route
import UIStore from './stores/UIStore';
import ContainerModel from './models/ContainerModel';
import SubView from './components/SubView';
UIStore.register({
  route: [SubView, ContainerModel],
})
import stores from './stores';
MetaStore.registerStores(stores);
