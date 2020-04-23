import api from '../api';
const t = api.i18n.getFixedT(null, 'metaui');

module.exports = {

  // --------------- 状态 ------------------
  state: {
    type: 'string',
  },

  // ------------- 字段 ------------------
  id: {
    type: 'SimpleModel',
    fields: {
      lable: {
        type: 'string',
        value: t('ID')
      },
      value: 'string',
      visible: {
        type: 'boolean',
        value: false // id默认隐藏
      },
      disable: {
        type: 'boolean',
        value: false
      },
      message: {
        type: 'string',
        value: t('ID字段无效')
      },
      required: {
        type: 'boolean',
        value: true
      },
      enum: {
        type: 'string',
        value: null
      },
      len: {
        type: 'number',
        value: null
      },
      pattern: {
        type: 'string',
        value: null
      },
      whitespace: {
        type: 'boolean',
        value: true
      },
      min: {
        type: 'number',
        value: 0
      },
      max: {
        type: 'number',
        value: 255
      },
    }
  },
  code: {
    type: 'SimpleModel',
    fields: {
      lable: {
        type: 'string',
        value: t('编码')
      },
      value: 'string',
      visible: {
        type: 'boolean',
        value: true
      },
      disable: {
        type: 'boolean',
        value: false
      },
      message: {
        type: 'string',
        value: t('Code字段无效')
      },
      required: {
        type: 'boolean',
        value: true
      },
      enum: {
        type: 'string',
        value: null
      },
      len: {
        type: 'number',
        value: null
      },
      pattern: {
        type: 'string',
        value: null
      },
      whitespace: {
        type: 'boolean',
        value: true
      },
      min: {
        type: 'number',
        value: 0
      },
      max: {
        type: 'number',
        value: 255
      },
    }
  },
  name: {
    type: 'SimpleModel',
    fields: {
      lable: {
        type: 'string',
        value: t('名称')
      },
      value: 'string',
      visible: {
        type: 'boolean',
        value: true
      },
      disable: {
        type: 'boolean',
        value: false
      },
      message: {
        type: 'string',
        value: t('名称字段无效')
      },
      required: {
        type: 'boolean',
        value: true
      },
      enum: {
        type: 'string',
        value: null
      },
      len: {
        type: 'number',
        value: null
      },
      pattern: {
        type: 'string',
        value: null
      },
      whitespace: {
        type: 'boolean',
        value: true
      },
      min: {
        type: 'number',
        value: 0
      },
      max: {
        type: 'number',
        value: 255
      },
    }
  },

  // 按钮
  previousBtn: {
    type: 'SimpleModel',
    fields: {
      text: {
        type: 'string',
        value: t('上一张')
      },
      visible: {
        type: 'boolean',
        value: true
      },
      disable: {
        type: 'boolean',
        value: false
      },
      //onClick: {
      //  name: "bizStore.previous"
      //}
    }
  },
  nextBtn: {
    type: 'SimpleModel',
    fields: {
      text: {
        type: 'string',
        value: t('下一张')
      },
      visible: {
        type: 'boolean',
        value: true
      },
      disable: {
        type: 'boolean',
        value: false
      },
      //onClick: {
      //  name: "bizStore.next"
      //}
    }
  },
  firstBtn: {
    type: 'SimpleModel',
    fields: {
      text: {
        type: 'string',
        value: t('首张')
      },
      visible: {
        type: 'boolean',
        value: true
      },
      disable: {
        type: 'boolean',
        value: false
      },
      //onClick: {
      //  name: "bizStore.first"
      //}
    }
  },
  lastBtn: {
    type: 'SimpleModel',
    fields: {
      text: {
        type: 'string',
        value: t('末张')
      },
      visible: {
        type: 'boolean',
        value: true
      },
      disable: {
        type: 'boolean',
        value: false
      },
      //onClick: {
      //  name: "bizStore.last"
      //}
    }
  },
  // --------------- actions ---------------------
  optionBtn: {
    type: 'SimpleModel',
    fields: {
      text: {
        type: 'string',
        value: t('设置')
      },
      visible: {
        type: 'boolean',
        value: true
      },
      disable: {
        type: 'boolean',
        value: false
      },
      //onClick: {
      //  name: "bizStore.option"
      //}
    }
  },
  searchBtn: {
    type: 'SimpleModel',
    fields: {
      text: {
        type: 'string',
        value: t('查找')
      },
      visible: {
        type: 'boolean',
        value: true
      },
      disable: {
        type: 'boolean',
        value: false
      },
      //onClick: {
      //  name: "bizStore.search"
      //}
    }
  },
  locationBtn: {
    type: 'SimpleModel',
    fields: {
      text: {
        type: 'string',
        value: t('查找')
      },
      visible: {
        type: 'boolean',
        value: true
      },
      disable: {
        type: 'boolean',
        value: false
      },
      //onClick: {
      //  name: "bizStore.location"
      //}
    }
  },
  cancelBtn: {
    type: 'SimpleModel',
    fields: {
      text: {
        type: 'string',
        value: t('关闭')
      },
      visible: {
        type: 'boolean',
        value: true
      },
      disable: {
        type: 'boolean',
        value: false
      },
    }
  },
  // --------------- edit ---------------------
  addBtn: {
    type: 'SimpleModel',
    fields: {
      text: {
        type: 'string',
        value: t('新增')
      },
      visible: {
        type: 'boolean',
        value: true
      },
      disable: {
        type: 'boolean',
        value: false
      },
      //onClick: {
      //  name: "bizStore.add"
      //}
    }
  },
  editBtn: {
    type: 'SimpleModel',
    fields: {
      text: {
        type: 'string',
        value: t('修改')
      },
      visible: {
        type: 'boolean',
        value: true
      },
      disable: {
        type: 'boolean',
        value: false
      },
      //onClick: {
      //  name: "bizStore.edit"
      //}
    }
  },
  refreshBtn: {
    type: 'SimpleModel',
    fields: {
      text: {
        type: 'string',
        value: t('刷新')
      },
      visible: {
        type: 'boolean',
        value: true
      },
      disable: {
        type: 'boolean',
        value: false
      },
      //onClick: {
      //  name: "bizStore.refresh"
      //}
    }
  },
  saveBtn: {
    type: 'SimpleModel',
    fields: {
      text: {
        type: 'string',
        value: t('保存')
      },
      visible: {
        type: 'boolean',
        value: true
      },
      disable: {
        type: 'boolean',
        value: false
      },
      //onClick: {
      //  name: "bizStore.save"
      //}
    }
  },
  saveAddBtn: {
    type: 'SimpleModel',
    fields: {
      text: {
        type: 'string',
        value: t('保存新增')
      },
      visible: {
        type: 'boolean',
        value: true
      },
      disable: {
        type: 'boolean',
        value: false
      },
      //onClick: {
      //  name: "bizStore.saveAdd"
      //}
    }
  },
  deleteBtn: {
    type: 'SimpleModel',
    fields: {
      text: {
        type: 'string',
        value: t('删除')
      },
      visible: {
        type: 'boolean',
        value: true
      },
      disable: {
        type: 'boolean',
        value: false
      },
      //onClick: {
      //  name: "bizStore.delete"
      //}
    }
  },
  copyBtn: {
    type: 'SimpleModel',
    fields: {
      text: {
        type: 'string',
        value: t('拷贝')
      },
      visible: {
        type: 'boolean',
        value: true
      },
      disable: {
        type: 'boolean',
        value: false
      },
      //onClick: {
      //  name: "bizStore.copy"
      //}
    }
  },
  abandonBtn: {
    type: 'SimpleModel',
    fields: {
      text: {
        type: 'string',
        value: t('放弃')
      },
      visible: {
        type: 'boolean',
        value: true
      },
      disable: {
        type: 'boolean',
        value: false
      },
      //onClick: {
      //  name: "bizStore.abandon"
      //}
    }
  },
  submitBtn: {
    type: 'SimpleModel',
    fields: {
      text: {
        type: 'string',
        value: t('提交')
      },
      visible: {
        type: 'boolean',
        value: true
      },
      disable: {
        type: 'boolean',
        value: false
      },
      //onClick: {
      //  name: "bizStore.submit"
      //}
    }
  },
  unsubmitBtn: {
    type: 'SimpleModel',
    fields: {
      text: {
        type: 'string',
        value: t('撤回')
      },
      visible: {
        type: 'boolean',
        value: true
      },
      disable: {
        type: 'boolean',
        value: false
      },
      //onClick: {
      //  name: "bizStore.unsubmit"
      //}
    }
  },
  // --------------- draft ---------------------
  draftBtn: {
    type: 'SimpleModel',
    fields: {
      text: {
        type: 'string',
        value: t('草稿')
      },
      visible: {
        type: 'boolean',
        value: true
      },
      disable: {
        type: 'boolean',
        value: false
      },
      //onClick: {
      //  name: "bizStore.draft"
      //}
    }
  },
  saveDraftBtn: {
    type: 'SimpleModel',
    fields: {
      text: {
        type: 'string',
        value: t('保存草稿')
      },
      visible: {
        type: 'boolean',
        value: true
      },
      disable: {
        type: 'boolean',
        value: false
      },
      //onClick: {
      //  name: "bizStore.saveDraft"
      //}
    }
  },
  // --------------- audit ---------------------
  auditBtn: {
    type: 'SimpleModel',
    fields: {
      text: {
        type: 'string',
        value: t('审核')
      },
      visible: {
        type: 'boolean',
        value: true
      },
      disable: {
        type: 'boolean',
        value: false
      },
      //onClick: {
      //  name: "bizStore.audit"
      //}
    }
  },
  unauditBtn: {
    type: 'SimpleModel',
    fields: {
      text: {
        type: 'string',
        value: t('弃审')
      },
      visible: {
        type: 'boolean',
        value: true
      },
      disable: {
        type: 'boolean',
        value: false
      },
      //onClick: {
      //  name: "bizStore.unaudit"
      //}
    }
  },
  changeBtn: {
    type: 'SimpleModel',
    fields: {
      text: {
        type: 'string',
        value: t('变更')
      },
      visible: {
        type: 'boolean',
        value: true
      },
      disable: {
        type: 'boolean',
        value: false
      },
      //onClick: {
      //  name: "bizStore.change"
      //}
    }
  },
  // --------------- print ---------------------
  printBtn: {
    type: 'SimpleModel',
    fields: {
      text: {
        type: 'string',
        value: t('打印')
      },
      visible: {
        type: 'boolean',
        value: true
      },
      disable: {
        type: 'boolean',
        value: false
      },
      //onClick: {
      //  name: "bizStore.print"
      //}
    }
  },
  printDirectBtn: {
    type: 'SimpleModel',
    fields: {
      text: {
        type: 'string',
        value: t('快速打印')
      },
      visible: {
        type: 'boolean',
        value: true
      },
      disable: {
        type: 'boolean',
        value: false
      },
      //onClick: {
      //  name: "bizStore.printDirect"
      //}
    }
  },
  printPreviewBtn: {
    type: 'SimpleModel',
    fields: {
      text: {
        type: 'string',
        value: t('打印预览')
      },
      visible: {
        type: 'boolean',
        value: true
      },
      disable: {
        type: 'boolean',
        value: false
      },
      //onClick: {
      //  name: "bizStore.printPreview"
      //}
    }
  },
  printDetailBtn: {
    type: 'SimpleModel',
    fields: {
      text: {
        type: 'string',
        value: t('打印明细标签')
      },
      visible: {
        type: 'boolean',
        value: true
      },
      disable: {
        type: 'boolean',
        value: false
      },
      //onClick: {
      //  name: "bizStore.printDetail"
      //}
    }
  },
  printDesignBtn: {
    type: 'SimpleModel',
    fields: {
      text: {
        type: 'string',
        value: t('打印设计')
      },
      visible: {
        type: 'boolean',
        value: true
      },
      disable: {
        type: 'boolean',
        value: false
      },
      //onClick: {
      //  name: "bizStore.printDesign"
      //}
    }
  },
  printInfoBtn: {
    type: 'SimpleModel',
    fields: {
      text: {
        type: 'string',
        value: t('打印情况')
      },
      visible: {
        type: 'boolean',
        value: true
      },
      disable: {
        type: 'boolean',
        value: false
      },
      //onClick: {
      //  name: "bizStore.printDetail"
      //}
    }
  },
  // --------------- export & import ---------------------
  exportBtn: {
    type: 'SimpleModel',
    fields: {
      text: {
        type: 'string',
        value: t('查找')
      },
      visible: {
        type: 'boolean',
        value: true
      },
      disable: {
        type: 'boolean',
        value: false
      },
      //onClick: {
      //  name: "bizStore.export"
      //}
    }
  },
  importBtn: {
    type: 'SimpleModel',
    fields: {
      text: {
        type: 'string',
        value: t('导入')
      },
      visible: {
        type: 'boolean',
        value: true
      },
      disable: {
        type: 'boolean',
        value: false
      },
      //onClick: {
      //  name: "bizStore.import"
      //}
    }
  },
  downloadImportTemplateBtn: {
    type: 'SimpleModel',
    fields: {
      text: {
        type: 'string',
        value: t('下载导入模板')
      },
      visible: {
        type: 'boolean',
        value: true
      },
      disable: {
        type: 'boolean',
        value: false
      },
      //onClick: {
      //  name: "bizStore.downloadImportTemplate"
      //}
    }
  },
  // --------------- attachment ---------------------
  attachmentBtn: {
    type: 'SimpleModel',
    fields: {
      text: {
        type: 'string',
        value: t('附件')
      },
      visible: {
        type: 'boolean',
        value: true
      },
      disable: {
        type: 'boolean',
        value: false
      },
      //onClick: {
      //  name: "bizStore.attachment"
      //}
    }
  },

  // --------------- message ---------------------
  messageBtn: {
    type: 'SimpleModel',
    fields: {
      text: {
        type: 'string',
        value: t('消息')
      },
      visible: {
        type: 'boolean',
        value: true
      },
      disable: {
        type: 'boolean',
        value: false
      },
      //onClick: {
      //  name: "bizStore.message"
      //}
    }
  },

  // --------------- 生单 ---------------------
  // --------------- 选单 ---------------------
  // --------------- 联查 ---------------------
}
