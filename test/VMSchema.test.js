const chai = require('chai');
const expect = chai.expect;
const VMSchema = require('../src/VMSchema');

describe('视图 Schema', () => {

  it('可以自定义视图模型', () => {
    // 所有字段，包括实体、过滤、按钮等都是字段
    const json = VMSchema.loadJson({
      code: {
        type: 'SimpleModel',
        fields: {
          lable: {
            type: 'string',
            default: '编码'
          },
          visible: {
            type: 'boolean',
            default: true
          },
          disable: {
            type: 'boolean',
            default: false
          },
          default: {
            type: 'string'
          },
        }
      },
      details: {
        type: 'TableModel',
        fields: {
          code: {
            type: 'SimpleModel',
            fields: {
              lable: {
                type: 'string',
                default: '编码'
              },
              visible: {
                type: 'boolean',
                default: true
              },
              disable: {
                type: 'boolean',
                default: false
              },
              default: {
                type: 'string'
              },
            }
          }
        }
      },
      search: {
        type: 'FilterModel',
        fields: {

        }
      },
      btn1: {
        type: 'SimpleModel',
        fields: {
          text: {
            type: 'string',
            default: '按钮1'
          },
          visible: {
            type: 'boolean',
            default: true
          },
          disable: {
            type: 'boolean',
            default: false
          },
        }
      }
    })

    //console.log(JSON.stringify(json, null, 2))
    expect(json).to.be.eql({
      "code": {
        "type": "SimpleModel",
        "fields": {
          "lable": {
            "type": "string",
            "default": "编码"
          },
          "visible": {
            "type": "boolean",
            "default": true
          },
          "disable": {
            "type": "boolean",
            "default": false
          },
          "default": {
            "type": "string"
          }
        }
      },
      "details": {
        "type": "TableModel",
        "fields": {
          "code": {
            "type": "SimpleModel",
            "fields": {
              "lable": {
                "type": "string",
                "default": "编码"
              },
              "visible": {
                "type": "boolean",
                "default": true
              },
              "disable": {
                "type": "boolean",
                "default": false
              },
              "default": {
                "type": "string"
              }
            }
          }
        }
      },
      "search": {
        "type": "FilterModel",
        "fields": {}
      },
      "btn1": {
        "type": "SimpleModel",
        "fields": {
          "text": {
            "type": "string",
            "default": "按钮1"
          },
          "visible": {
            "type": "boolean",
            "default": true
          },
          "disable": {
            "type": "boolean",
            "default": false
          }
        }
      }
    })
  })

  it('支持合并模板', () => {
    // 所有字段，包括实体、过滤、按钮等都是字段
    const json = VMSchema.loadJson({
      code: {
        type: 'SimpleModel',
        fields: {
          lable: {
            type: 'string',
            default: '编码'
          },
          visible: {
            type: 'boolean',
            default: true
          },
          disable: {
            type: 'boolean',
            default: false
          },
          default: {
            type: 'string'
          },
        }
      }
    },{
      details: {
        type: 'TableModel',
        fields: {
          code: {
            type: 'SimpleModel',
            fields: {
              lable: {
                type: 'string',
                default: '编码'
              },
              visible: {
                type: 'boolean',
                default: true
              },
              disable: {
                type: 'boolean',
                default: false
              },
              default: {
                type: 'string'
              },
            }
          }
        }
      },
      search: {
        type: 'FilterModel',
        fields: {

        }
      },
      btn1: {
        type: 'SimpleModel',
        fields: {
          text: {
            type: 'string',
            default: '按钮1'
          },
          visible: {
            type: 'boolean',
            default: true
          },
          disable: {
            type: 'boolean',
            default: false
          },
        }
      }
    })

    //console.log(JSON.stringify(json, null, 2))
    expect(json).to.be.eql({
        "code": {
          "type": "SimpleModel",
          "fields": {
            "lable": {
              "type": "string",
              "default": "编码"
            },
            "visible": {
              "type": "boolean",
              "default": true
            },
            "disable": {
              "type": "boolean",
              "default": false
            },
            "default": {
              "type": "string"
            }
          }
        },
        "details": {
          "type": "TableModel",
          "fields": {
            "code": {
              "type": "SimpleModel",
              "fields": {
                "lable": {
                  "type": "string",
                  "default": "编码"
                },
                "visible": {
                  "type": "boolean",
                  "default": true
                },
                "disable": {
                  "type": "boolean",
                  "default": false
                },
                "default": {
                  "type": "string"
                }
              }
            }
          }
        },
        "search": {
          "type": "FilterModel",
          "fields": {}
        },
        "btn1": {
          "type": "SimpleModel",
          "fields": {
            "text": {
              "type": "string",
              "default": "按钮1"
            },
            "visible": {
              "type": "boolean",
              "default": true
            },
            "disable": {
              "type": "boolean",
              "default": false
            }
          }
        }
    })
  })
})
