# metaui

模型驱动开发框架，通过建模+扩展代替自由编码的快速开发方式

# 名词解释

| 名词       | 解释                                                                    |
| ---------- | ----------------------------------------------------------------------- |
| 实体       | 实体元数据                                                               |
| 模板       | UI 元数据，单据、模板、实体、字段、工具条、命令、扩展                   |
| 视图协议   | 界面描述结构，容器、控件、扩展                                          |
| 模型协议   | 视图模型结构，实体、字段、行为                                          |
| 业务组件   | 常规 UI 组件                                                            |
| 元数据组件 | 接收元数据、视图模型两个参数的组件，封装已有的业务组件，支持元数据      |
| 单据组件   | 单据类型对应的组件，单据、参照、列表、报表等                            |
| 容器组件   | 布局类的组件，卡片、布局、导航条等                                      |
| 数据组件   | 输入框等基础控件                                                        |
| 视图模型   | 包含：字段、行为的前端模型，VM                                          |
| 代码模板   | 生成 VM 的 字段、行为、事件、业务模型                                   |
| 数据模型   | SimpleModel、GridModel、FilterModel、ReferModel 等数据结构              |
| 业务模型   | 多端共用的基于场景的业务行为，供 VM 里事件调用                          |
| 表达式引擎 | 简单的逻辑直接配置表达式代替编程扩展，JS 语法，支持聚合、日期、数学函数 |
| 业务扩展   | 多端共用，分成 4 层：平台、领域、单据、端                               |
| 业务逻辑   | Block/Proccesser，单据模型转发                                          |
| 业务服务   | 业务模型调用后端接口，单据的增删改、审核弃审等对应的后端业务服务        |
| MDF        | 模型驱动开发框架，通过建模+扩展代替自由编码的开发方式                   |
| 低代码平台 | 用可视化的方式快速建模的平台，为 MDF 建模                               |
 