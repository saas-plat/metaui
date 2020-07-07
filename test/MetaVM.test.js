import {
  reaction,
  configure,
} from "mobx";
import {
  expect
} from 'chai';

import {
  ViewModel
}
from '@saas-plat/metaschema';

import {
  MetaVM
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
    const vm = MetaVM.createModel(Partner.name, Partner.schema);
    console.log(vm)
  })
})
