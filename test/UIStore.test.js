import {
  useStrict,
  observable
} from "mobx";
const {
  expect
} = require('chai');

import UIStore from '../src/UIStore';
import {
  Layout
} from '../src/models/Layout';
import {
  Form,
  FormItem
} from '../src/models/Form';
import {
  Input
} from '../src/models/Input';
import {
  Button
} from '../src/models/Button';

useStrict(true)

class NoneComponent {

}

before(() => {
  UIStore.register({
    // common
    view: NoneComponent,
    navbar: NoneComponent,
    //  input
    input: NoneComponent,
    decimal: NoneComponent,
    button: NoneComponent,
    voucher: NoneComponent,
    formitem: NoneComponent,
    list: NoneComponent
  })
})

describe('UI模板', () => {

  it('从Schema中加载视图模板', () => {
    const s = UIStore.createSchema({
      model: 'Layout',
      type: 'view',
      items: [{
        model: 'Layout',
        type: 'navbar',
        text: 'this is title',
        items: [{
          model: 'Button',
          type: 'button',
          name: 'search',
          icon: 'search',
          onClick: {
            model: 'Action',
            name: 'dosamething'
          }
        }, {
          model: 'Button',
          type: 'button',
          name: 'save',
          text: '保存'
        }]
      }, {
        model: 'Form',
        type: 'voucher',
        items: [{
          model: 'Layout',
          type: 'list',
          layout: 'list',
          text: 'header 1',
          items: [{
            model: 'FormItem',
            type: 'formitem',
            input: 'decimal',
            text: 'item1',
            value: '$item1',
            onChange: {
              model: 'Action',
              name: 'action1'
            }
          }, {
            model: 'FormItem',
            type: 'formitem',
            input: 'decimal',
            text: 'item2',
            value: '$item1'
          }]
        }],
        onLoad: {
          model: 'Action',
          name: 'loadVoucher',
          args: {
            item1: 100,
            item2: '$item1+1000'
          }
        },
        onLoaded: [{
          model: 'Action',
          name: 'loaded1'
        }, {
          model: 'Action',
          name: 'loaded2'
        }]
      }]
    });
    //console.log(JSON.stringify(s,null,2));
    const v = UIStore.create(s, {
      item1: 1000.00
    }).ui;
    // navbar
    expect(v.items[0]).to.be.a.instanceof(Layout);
    expect(v.items[0].text).to.be.equal('this is title');
    expect(v.items[0].type).to.be.equal('navbar');
    expect(v.items[0].items.length).to.be.equal(2);
    console.log(v.items[0].items[0].onClick)
    expect(v.items[0].items[0].onClick.name).to.be.equal('dosamething');

    // voucher
    //console.log(v.items[1].onLoad.args)
    expect(v.items[1]).to.be.a.instanceof(Form);
    expect(v.items[1].items.length).to.be.equal(1);
    expect(v.items[1].onLoad.args.item1).to.be.equal(100);
    expect(v.items[1].onLoad.args.item2).to.be.equal(2000);
    expect(v.items[1].onAfterLoad.length).to.be.equal(2);
    expect(v.items[1].onAfterLoad[1].name).to.be.equal('loaded2');

    // container
    expect(v.items[1].items[0]).to.be.a.instanceof(Layout);
    expect(v.items[1].items[0].layout).to.be.equal('list');
    expect(v.items[1].items[0].text).to.be.equal('header 1');

    // formitem
    //console.log(v.items[1].items[0].items)
    expect(v.items[1].items[0].items.length).to.be.equal(2);
    expect(v.items[1].items[0].items[0]).to.be.a.instanceof(FormItem);
    expect(v.items[1].items[0].items[1]).to.be.a.instanceof(FormItem);

    // input
    expect(v.items[1].items[0].items[0].inputItem).to.be.a.instanceof(Input);
    expect(v.items[1].items[0].items[1].inputItem).to.be.a.instanceof(Input);
    expect(v.items[1].items[0].items[0].inputItem.type).to.be.equal('decimal');
    expect(v.items[1].items[0].items[0].inputItem.placeholder).to.be.undefined;
    expect(v.items[1].items[0].items[0].inputItem.clear).to.be.equal(false);
    expect(v.items[1].items[0].items[0].inputItem.editable).to.be.equal(true);
    expect(v.items[1].items[0].items[0].inputItem.disable).to.be.equal(false);
    expect(v.items[1].items[0].items[0].inputItem.maxLength).to.be.equal(undefined);
    expect(v.items[1].items[0].items[0].inputItem.labelNumber).to.be.equal(undefined);
    expect(v.items[1].items[0].items[0].inputItem.defaultValue).to.be.equal(undefined);
    expect(v.items[1].items[0].items[0].inputItem.error).to.be.equal(true);
    expect(v.items[1].items[0].items[0].inputItem.extra).to.be.equal(undefined);
    expect(v.items[1].items[0].items[0].inputItem.text).to.be.equal('item1');
    expect(v.items[1].items[0].items[0].inputItem.value).to.be.equal(1000.00);
    //console.log(v.items[1].items[0].items[0].inputItem.onChange)
    expect(v.items[1].items[0].items[0].inputItem.onChange.name).to.be.equal('action1');
    expect(v.items[1].items[0].items[0].inputItem.onBeforeChange).to.be.equal(null);
    expect(v.items[1].items[0].items[0].inputItem.onAfterChange).to.be.equal(null);
    expect(v.items[1].items[0].items[0].inputItem.onBlur).to.be.equal(null);
    expect(v.items[1].items[0].items[0].inputItem.onFocus).to.be.equal(null);
    expect(v.items[1].items[0].items[0].inputItem.onErrorClick).to.be.equal(null);
    expect(v.items[1].items[0].items[0].inputItem.onExtraClick).to.be.equal(null);

  })

  it('UI模型读取和修改ViewModel', () => {
    const s = UIStore.createSchema({
      type: 'voucher',
      items: [{
        type: 'list',
        layout: 'list',
        text: 'header 1',
        items: [{
          type: 'formitem',
          input: 'decimal',
          text: 'item1',
          value: '$item1.value',
          setValue: 'item1.value',
          visible: '$item1.visible',
          setVisible: 'item1.visible',
          onChange: 'action1'
        }, {
          type: 'formitem',
          input: 'decimal',
          text: 'item2',
          getValue: '$item1+1'
        }]
      }],
      onLoad: {
        name: 'loadVoucher',
        item1: 100,
        item2: '$item1+1000'
      },
      onLoaded: [{
        name: 'loaded1'
      }, {
        name: 'loaded2'
      }]
    });
    //console.log(JSON.stringify(s,null,2));
    const vm = observable({
      item1: {
        visible: true,
        value: 1000.00
      }
    })
    const ui = UIStore.create(s, vm).ui;

    const uiitem1 = ui.items[0].items[0].inputItem;
    expect(uiitem1.value).to.be.equal(1000)

    // 直接ui赋值
    uiitem1.value = 2000;
    uiitem1.visible = false;
    expect(uiitem1.value).to.be.equal(2000)
    expect(uiitem1.visible).to.be.false;

    // 会影响到vm
    expect(vm.item1.value).to.be.equal(2000)
    expect(vm.item1.visible).to.be.false;

  })
})
