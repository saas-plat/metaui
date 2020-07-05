import BaseModel from './BaseModel';

import FormModel from './FormModel';
import FormListModel from './FormListModel';

import TreeListModel from './TreeListModel';
import CardModel from './CardModel';

import EditListModel from './EditListModel';

export default {
  // 增加一个自定义模板，里面什么也没有预制需要开发者自己控制
  BaseModel,

  // 单据
  FormModel,
  FormListModel,

  // 期初列表
  EditListModel,

  // 档案
  TreeListModel,
  CardModel,
}
