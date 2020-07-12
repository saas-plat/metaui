import {
  expect
} from 'chai';

import {
  View,
  ViewModel
}
from '@saas-plat/metaschema';
import i18next from 'i18next';
i18next.init();

import {
  MetaVM,
  MetaUI
} from '../src';

describe('VM模型', () => {

  it('从Schema中创建视图模型', () => {
    const Partner = ViewModel('Partner', {
      // 字段
      "id": {
        "type": "SimpleModel",
        "fields": {
          "lable": {
            "type": "string",
            "default": "ID"
          },
          "value": "string",
          "dataSouce": {
            "type": "string",
            "default": "aa.pertner"
          },
        }
      },
      "code": {
        "type": "SimpleModel",
        "fields": {
          "lable": {
            "type": "string",
            "default": "客户编码"
          },
          "value": "string",
          "dataSouce": {
            "type": "string",
            "default": "aa.pertner"
          },
        }
      },
      "name": {
        "type": "SimpleModel",
        "fields": {
          "lable": {
            "type": "string",
            "default": "客户名称"
          },
          "value": "string",
          "dataSouce": {
            "type": "string",
            "default": "aa.pertner"
          },
        }
      },
      "cusCreLine": {
        "type": "SimpleModel",
        "fields": {
          "lable": {
            "type": "string",
            "default": "信用额度"
          },
          "value": "number"
        }
      },
      "pertnerCategoryId": {
        "type": "SimpleModel",
        "fields": {
          "lable": {
            "type": "string",
            "default": "客户分类"
          },
          "value": "string",
          "dataSouce": {
            "type": "string",
            "default": "aa.pertner"
          },
        }
      },
      "pertnerAreaId": {
        "type": "SimpleModel",
        "fields": {
          "lable": {
            "type": "string",
            "default": "客户地区"
          },
          "value": "string",
          "dataSouce": {
            "type": "string",
            "default": "aa.pertner"
          },
        }
      },
      "pertnerLevelId": {
        "type": "SimpleModel",
        "fields": {
          "lable": {
            "type": "string",
            "default": "客户级别"
          },
          "value": "string",
          "dataSouce": {
            "type": "string",
            "default": "aa.pertner"
          },
        }
      },
      "pertnerIndustryId": {
        "type": "SimpleModel",
        "fields": {
          "lable": {
            "type": "string",
            "default": "客户行业"
          },
          "value": "string",
          "dataSouce": {
            "type": "string",
            "default": "aa.pertner"
          },
        }
      },
    });
    //  console.log(JSON.stringify(Partner,null,2))
    const PartnerVM = MetaVM.createModel(Partner.name, Partner.schema);
    const partner = PartnerVM.create();
    // console.log(JSON.stringify(partner))
    expect(JSON.parse(JSON.stringify(partner))).to.be.eql({
      "id": {},
      "code": {},
      "name": {},
      "cusCreLine": {},
      "pertnerCategoryId": {},
      "pertnerAreaId": {},
      "pertnerLevelId": {},
      "pertnerIndustryId": {}
    });
  })

  it('UI绑定VM', () => {
    const s = View({
      "type": "view",
      "layout": "horizontal",
      "items": [{
        "type": "view",
        "layout": "vertical",
        "items": [{
          "type": "toolbar",
          "items": [{
            "bind": "addTreeBtn",
            "type": "button",
            "onClick": "PartnerList.add"
          }, {
            "bind": "editTreeBtn",
            "type": "button",
            "onClick": "PartnerList.edit"
          }, {
            "bind": "deleteTreeBtn",
            "type": "button",
            "onClick": "PartnerList.delete"
          }]
        }]
      }]
    });
    //console.log(JSON.stringify(s,null,2));
    const m = ViewModel('ViewModel1', {
      "inventorys": {
        "type": "TableModel",
        "fields": {
          "dataSource": {
            "type": "string",
            "default": "aa.inventorys"
          },
          "columns": {
            "id": {
              "lable": {
                "type": "string",
                "default": "ID"
              },
              "default": "string",
              "dataSouce": {
                "type": "string",
                "default": "id"
              },
            },
            "code": {
              "lable": {
                "type": "string",
                "default": "编码"
              },
              "default": "string",
              "dataSouce": {
                "type": "string",
                "default": "code"
              },
            },
            "name": {
              "lable": {
                "type": "string",
                "default": "名称"
              },
              "default": "string",
              "dataSouce": {
                "type": "string",
                "default": "name"
              },
            }
          }
        }
      },
      "addTreeBtn": {
        "type": "SimpleModel",
        "fields": {
          "name": "string"
        },
        "default": {
          "name": "add"
        }
      },
      "editTreeBtn": {
        "type": "SimpleModel",
        "fields": {
          "name": "string"
        },
        "default": {
          "name": "edit"
        }
      },
      "deleteTreeBtn": {
        "type": "SimpleModel",
        "fields": {
          "name": "string"
        },
        "default": {
          "name": "delete"
        }
      }
    });
    const VM = MetaVM.createModel(m.name, m.schema);

    expect(JSON.parse(JSON.stringify(m))).to.be.eql({
      "name": "ViewModel1",
      "schema": {
        "type": "BaseModel",
        "fields": [{
          "key": "inventorys",
          "type": "TableModel",
          "fields": [{
            "key": "dataSource",
            "type": "string",
            "defValue": "aa.inventorys",
            "rules": {
              "type": "string"
            }
          }, {
            "key": "columns",
            "type": "object",
            "fields": [{
              "key": "id",
              "type": "object",
              "fields": [{
                "key": "lable",
                "type": "string",
                "defValue": "ID",
                "rules": {
                  "type": "string"
                }
              }, {
                "key": "default",
                "type": "string"
              }, {
                "key": "dataSouce",
                "type": "string",
                "defValue": "id",
                "rules": {
                  "type": "string"
                }
              }]
            }, {
              "key": "code",
              "type": "object",
              "fields": [{
                "key": "lable",
                "type": "string",
                "defValue": "编码",
                "rules": {
                  "type": "string"
                }
              }, {
                "key": "default",
                "type": "string"
              }, {
                "key": "dataSouce",
                "type": "string",
                "defValue": "code",
                "rules": {
                  "type": "string"
                }
              }]
            }, {
              "key": "name",
              "type": "object",
              "fields": [{
                "key": "lable",
                "type": "string",
                "defValue": "名称",
                "rules": {
                  "type": "string"
                }
              }, {
                "key": "default",
                "type": "string"
              }, {
                "key": "dataSouce",
                "type": "string",
                "defValue": "name",
                "rules": {
                  "type": "string"
                }
              }]
            }]
          }],
          "rules": {
            "type": "object"
          }
        }, {
          "key": "addTreeBtn",
          "type": "SimpleModel",
          "fields": [{
            "key": "name",
            "type": "string"
          }],
          "defValue": {
            "name": "add"
          },
          "rules": {
            "type": "object"
          }
        }, {
          "key": "editTreeBtn",
          "type": "SimpleModel",
          "fields": [{
            "key": "name",
            "type": "string"
          }],
          "defValue": {
            "name": "edit"
          },
          "rules": {
            "type": "object"
          }
        }, {
          "key": "deleteTreeBtn",
          "type": "SimpleModel",
          "fields": [{
            "key": "name",
            "type": "string"
          }],
          "defValue": {
            "name": "delete"
          },
          "rules": {
            "type": "object"
          }
        }],
        "actions": [],
        "conflicts": [],
        "mappings": {},
        "references": {},
        "syskeys": []
      }
    })

    const ui = MetaUI.create(s, VM.create());
    expect(ui).to.not.null;
  })
})
