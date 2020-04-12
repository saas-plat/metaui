import {
  configure,
  reaction,
  observable
} from "mobx";
const {
  expect
} = require('chai');

import UIStore from '../src/stores/UIStore';
import SimpleModel from '../src/models/SimpleModel';
import TableModel from '../src/models/TableModel';
import { computed } from "mobx";

configure({
  enforceActions: 'observed'
})

describe('UI模板', () => {

  it('Model的ownkeys问题', () => {
    const store = new UIStore();
    const model = new SimpleModel(store, {
      key: 'a',
      title: 'Root',
      value: 100,
      children: [new SimpleModel(store, {
        key: 'a-1',
        title: 'a-1',
        value: 10
      }), new SimpleModel(store, {
        key: 'a-2',
        title: 'a-2',
        b: 200
      }), new SimpleModel(store, {
        key: 'a-1-1',
        title: 'a-1-1',
        value: 90
      })]
    })

    console.log(Object.keys(model))
    expect(Object.keys(model)).to.be.eql(['store', 'key', 'name', 'type', 'title', 'value', 'children']);

  })

  it('Model支持序列化JSON', () => {
    const store = new UIStore();
    const gvm = {
      item1: 1000.00,
      data: [1, 2, 3].map(v => new SimpleModel(store, {
        value: v,
        text: '"' + v.toString() + '"'
      }))
    }
    const json = JSON.stringify(gvm, null, 2);
    expect(JSON.parse(json)).to.be.eql({
      "item1": 1000,
      "data": [{
          "value": "1",
          "text": "\"1\"",
          "key": "vm5",
          "name": "vm5"
        },
        {
          "value": "2",
          "text": "\"2\"",
          "key": "vm6",
          "name": "vm6"
        },
        {
          "value": "3",
          "text": "\"3\"",
          "key": "vm7",
          "name": "vm7"
        }
      ]
    })
  })

  it('SubModel可以合并赋值', () => {
    const store = new UIStore();
    const model = new SimpleModel(store, {
      sub: {
        a: 1,
        b: 2
      }
    })
    model.sub = {
      a: 2,
      b: 1
    }
    const s = model.sub;
    expect(s.a).to.be.eql(2);
    expect(model.sub.b).to.be.eql(1);

    // 创建没有的属性
    model.newprop = {
      c: 1
    }
    model.newprop = {
      c: 2
    }
    expect(model.newprop.c).to.be.eql(2);
  })

  it('模型计算属性调用this也是proxy', () => {
    const store = new UIStore();
    const model = new TableModel(store, {
      dataSource: []
    })
    let ds;
    reaction(() => model.data, data => {
      ds = data;
    })
    model.addRow();
    expect(ds).to.be.eql(model.data);
  })

  it('支持校验规则', async () => {
    const store = new UIStore({
      table: [{
        name: 'aaa',
        code: '0001',
        age: 22
      }, {
        name: 'bbb',
        code: '0002',
        age: 33
      }, {
        name: 'ccc',
        code: '0003',
        age: 111
      }]
    });

    const simple = new SimpleModel(store, {
      value: 'xxxxxxxx',
      type: 'string',
      required: true,
      //message,
      //len,
      //pattern,
      //whitespace,
      min: 0,
      max: 100,
      //defaultField, //  数组元素类型
      //fields,
      //transform,
      //validator,
    })

    // 保证这里不报错
    // configure({
    //   computedConfigurable: true
    // })
    const obj = observable(simple)
    console.log(Object.keys(obj))

    expect(await simple.validate()).to.be.true;

    simple.type = 'number';
    expect(await simple.validate()).to.be.false;
    expect(simple.error).to.be.eql('value is not a number');

    const model = new TableModel(store, {
      dataSource: '$table',
      columns: [{
        type: 'string',
        dataIndex: 'name',
        required: true,
      }, {
        type: 'string',
        dataIndex: 'code',
        required: true,
      }, {
        type: 'number',
        dataIndex: 'age',
        min: 0,
        max: 100,
        message: 'age err'
      }]
    })
    model.addRow();
    expect(await model.validate()).to.be.false;

    expect(model.data[2].error).to.be.eql('age err');
    expect(model.data[2].value.age.error).to.be.eql('age err');
  })
})
