import {
  reaction,
  configure,
} from "mobx";
const {
  expect
} = require('chai');

import UIStore from '../src/UIStore';
import ContainerModel from '../src/models/ContainerModel';
import SimpleModel from '../src/models/SimpleModel';
import ListModel from '../src/models/ListModel';
import ReferModel from '../src/models/ReferModel';

configure({
  enforceActions: 'observed'
})

class NoneComponent {

}

before(() => {
  UIStore.register({
    // common
    view: [NoneComponent, ContainerModel],
    list: [NoneComponent, ContainerModel],
    navbar: [NoneComponent, ContainerModel],
    //  input
    input: [NoneComponent, SimpleModel],
    decimal: [NoneComponent, SimpleModel],
    button: [NoneComponent, SimpleModel],
    select: [NoneComponent, ListModel],
    refer: [NoneComponent, ReferModel],
  })
})

describe('UI模板', () => {

  it('从Schema中加载视图模板', () => {
    const store = new UIStore();
    const s = UIStore.createSchema({
      type: 'view',
      items: [{
        type: 'navbar',
        text: 'this is title',
        items: [{
          type: 'button',
          name: 'search',
          icon: 'search',
          onClick: {
            name: 'dosamething'
          }
        }, {
          type: 'button',
          name: 'save',
          text: '保存'
        }]
      }, {
        type: 'view',
        items: [{
          type: 'list',
          layout: 'list',
          text: 'header 1',
          items: [{
            type: 'decimal',
            text: 'item1',
            value: '$item1',
            onChange: {
              name: 'action1'
            }
          }, {
            type: 'decimal',
            text: 'item2',
            value: '$item1'
          }, {
            type: 'select',
            text: 'item2',
            value: '$item1',
            data: '$data'
          }]
        }],
        onLoad: {
          name: 'loadVoucher',
          args: {
            item1: 100,
            item2: '$item1+1000'
          }
        },
        onLoaded: [{
          name: 'loaded1'
        }, {
          name: 'loaded2'
        }]
      }]
    });
    //console.log(JSON.stringify(s,null,2));
    const vm = {
      item1: 1000.00,
      data: [1, 2, 3].map(v => new SimpleModel(store, {
        value: v,
        text: '"' + v.toString() + '"'
      }))
    }
    store.setModel(vm);
    const v = store.build(UIStore.createSchema(s))
    //console.log(v.items[0])
    // navbar
    expect(v.items[0]).to.be.a.instanceof(ContainerModel);
    expect(v.items[0].text).to.be.equal('this is title');
    expect(v.items[0].type).to.be.equal('navbar');
    expect(v.items[0].items.length).to.be.equal(2);
    //console.log(v.items[0].items[0].onClick)
    expect(v.items[0].items[0].onClick.name).to.be.equal('dosamething');

    // voucher
    //console.log(v.items[1].onLoad.args)
    expect(v.items[1]).to.be.a.instanceof(ContainerModel);
    expect(v.items[1].items.length).to.be.equal(1);
    expect(v.items[1].onLoad.args.item1).to.be.equal(100);
    expect(v.items[1].onLoad.args.item2).to.be.equal(2000);
    expect(v.items[1].onLoaded.length).to.be.equal(2);
    expect(v.items[1].onLoaded[1].name).to.be.equal('loaded2');

    // container
    expect(v.items[1].items[0]).to.be.a.instanceof(ContainerModel);
    expect(v.items[1].items[0].layout).to.be.equal('list');
    expect(v.items[1].items[0].text).to.be.equal('header 1');

    // formitem
    //console.log(v.items[1].items[0].items)
    expect(v.items[1].items[0].items.length).to.be.equal(3);

    // input
    expect(v.items[1].items[0].items[0]).to.be.a.instanceof(SimpleModel);
    expect(v.items[1].items[0].items[1]).to.be.a.instanceof(SimpleModel);
    expect(v.items[1].items[0].items[0].type).to.be.equal('decimal');
    // expect(v.items[1].items[0].items[0].placeholder).to.be.undefined;
    // expect(v.items[1].items[0].items[0].clear).to.be.equal(false);
    // expect(v.items[1].items[0].items[0].editable).to.be.equal(true);
    // expect(v.items[1].items[0].items[0].disable).to.be.equal(false);
    // expect(v.items[1].items[0].items[0].maxLength).to.be.equal(undefined);
    // expect(v.items[1].items[0].items[0].labelNumber).to.be.equal(undefined);
    // expect(v.items[1].items[0].items[0].defaultValue).to.be.equal(undefined);
    // expect(v.items[1].items[0].items[0].error).to.be.equal(true);
    // expect(v.items[1].items[0].items[0].extra).to.be.equal(undefined);
    expect(v.items[1].items[0].items[0].text).to.be.equal('item1');
    expect(v.items[1].items[0].items[0].value).to.be.equal(1000.00);
    //console.log(v.items[1].items[0].items[0].onChange)
    expect(v.items[1].items[0].items[0].onChange.name).to.be.equal('action1');
    // expect(v.items[1].items[0].items[0].onBeforeChange).to.be.equal(null);
    // expect(v.items[1].items[0].items[0].onAfterChange).to.be.equal(null);
    // expect(v.items[1].items[0].items[0].onBlur).to.be.equal(null);
    // expect(v.items[1].items[0].items[0].onFocus).to.be.equal(null);
    // expect(v.items[1].items[0].items[0].onErrorClick).to.be.equal(null);
    // expect(v.items[1].items[0].items[0].onExtraClick).to.be.equal(null);

    //console.log(v.items[1].items[0].items[2].data)
    expect(v.items[1].items[0].items[2]).to.be.a.instanceof(ListModel);
    expect(v.items[1].items[0].items[2].data.length).to.be.equal(3);
    expect(v.items[1].items[0].items[2].data[0]).to.be.instanceof(SimpleModel);
    expect(v.items[1].items[0].items[2].data[1]).to.be.instanceof(SimpleModel);
    expect(v.items[1].items[0].items[2].data[2]).to.be.instanceof(SimpleModel);

    expect(v.items[1].items[0].items[2].data[2].value).to.be.equal(3);
    expect(v.items[1].items[0].items[2].data[2].text).to.be.equal('3');

  })

  it('UI模型读取和修改ViewModel', () => {
    const s = UIStore.createSchema({
      type: 'view',
      items: [{
        type: 'list',
        layout: 'list',
        text: 'header 1',
        items: [{
          type: 'decimal',
          text: 'price',
          bind: 'item1', // <<<<<<<<< bind item1
          onChange: 'action1'
        }, {
          type: 'decimal',
          text: 'item2',
          getValue: '$item1.value+1'
        }]
      }],
      onLoad: {
        name: 'loadVoucher',
        item1: 100,
        item2: '$item1.value+1000'
      },
      onLoaded: [{
        name: 'loaded1'
      }, {
        name: 'loaded2'
      }]
    });
    //console.log(JSON.stringify(s,null,2));
    const store = new UIStore();
    const vm = {
      item1: new SimpleModel(store, {
        visible: true,
        value: 1000.00
      })
    }
    store.setModel(vm);
    const ui = store.build(s);

    const uiitem1 = ui.items[0].items[0];
    expect(uiitem1.value).to.be.equal(1000)

    // 直接ui赋值
    uiitem1.value = 2000;
    uiitem1.visible = false;
    expect(uiitem1.value).to.be.equal(2000)
    expect(uiitem1.visible).to.be.false;

    // 会影响到vm
    expect(vm.item1.value).to.be.equal(2000)
    expect(vm.item1.visible).to.be.false;

    // 动态属性也可以观察到
    let rev;
    let ree;
    let reks;
    reaction(() => Object.keys(uiitem1), e => reks = e)
    reaction(() => 'newprop' in uiitem1, e => ree = e)
    reaction(() => uiitem1.newprop, v => rev = v)
    uiitem1.newprop = 'aaa'
    expect(rev).to.be.equal('aaa')
    expect(ree).to.be.equal(true)

    //console.log(Object.keys(uiitem1))
    expect(reks).to.be.eql(['store',
      'key',
      'name',
      'type',
      'visible',
      'value',
      'text',
      'onChange',
      'newprop'
    ])
  })

  it('UI模型读取和修改ViewModel', () => {
    const v = UIStore.create({
      name: 'item2',
      type: 'refer',
      displayField: 'f1',
      value: '$obj',
      setValue: 'obj',
      dropdownStyle: 'list',
      multiple: false,
      showSearch: true,
      dataSource: '$refobjs',
      onFocus: {
        name: 'query',
        query: '=obj1{a,b,c,d,e}',
        variables: '{pid:$id}', // 去掉查询变量一次取出全部
        idField: 'id',
        pidField: 'pid',
        sortField: 'f1', // 树形全部取回来需要按照树结构排序
        mapping: '={f1:$a,f2:$b,f3:$c}',
        pageSize: 200
      }
    }, {
      obj: {
        f1: 'BBBBBBBB',
        date: new Date(),
        f3: 1000000.55,
      },
      refobjs: [{
        a: 1
      }, {
        a: 20.11
      }],
    }).ui;
    expect(v.store.model.obj.f1).to.be.eql('BBBBBBBB')
    expect(v.displayValue.label).to.be.eql('BBBBBBBB')
  })
})
