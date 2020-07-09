// UI组件的基类
export UIComponent from './components/UIComponent';
// 组件容器
export UIContainer from './components/UIContainer';
// 组件类型管理器
export MetaUI from './MetaUI';
export BizModel from './vmodels/BizModel';
export EventModel from './EventModel';
export MetaVM from './MetaVM';
// ui模型渲染器
export UIRender from './components/UIRender';
// ui模型类型
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
import MetaVM from './MetaVM';
// register route
import MetaUI from './MetaUI';
import ContainerModel from './models/ContainerModel';
import SubView from './components/SubView';
MetaUI.register({
  route: [SubView, ContainerModel],
})
import vmodels from './vmodels';
MetaVM.register(vmodels);
export i18n from './i18n';
