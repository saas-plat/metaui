import {
  configure,
} from "mobx";
const {
  expect
} = require('chai');

import UIStore from '../src/UIStore';
import SimpleModel from '../src/models/SimpleModel';

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
    debugger
    model.newprop = {
      c: 2
    }
    expect(model.newprop.c).to.be.eql(2);
  })
})
