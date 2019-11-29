# UI组件库

提供全端的统一UI建模，和各端的独立渲染组件

## 模型

模型提供了统一的UI描述类型，多端通用协议

1. 属性表达式，可以是一个常量或者是一个表达式，每个UI级别的模型观察数据级别的视图模型
2. 事件表达式，行为的发生都有统一事件配置对应的行为
3. UI行为，简单的模型状态操作，数据级别的操作由视图模型提供，业务级别的操作由业务模型提供

模型类型

ActionModel
ContainerModel

ButtonModel
InputModel
EditTableModel
EditColumnModel
EditCellModel
FormModel
FormItemModel
RuleModel

FilterModel
TableModel
ColumnModel
CellModel
ChartModel

## 组件

提供web、mobile、touch等多端组件，组件需要根据模型进行渲染

# 反馈API

提供跨端的常用反馈，比如操作结果的消息、警告、确认、提示、授权等标准形式
