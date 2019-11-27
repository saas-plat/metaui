import UIStore from '../src/UIStore';
import {
  Container
} from '../src/models/Container';
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
const {
  expect
} = require('chai');

class NoneComponent {

}

before(() => {
  UIStore.register({
    // common
    view: {
      component: NoneComponent,
      model: Container
    },
    navbar: {
      component: NoneComponent,
      model: Container
    },
    //  input
    input: {
      component: NoneComponent,
      model: Input
    },
    decimal:{
      component: NoneComponent,
      model: Input
    },
    button: {
      component: NoneComponent,
      model: Button
    },
    voucher: {
      component: NoneComponent,
      model: Form
    }
  })
})

describe('视图模板', () => {

  it('从Schema中加载视图模板', () => {
    const s = UIStore.createSchema({
      type: 'view',
      containers: [{
        type: 'navbar',
        text: 'this is title',
        items: [{
          type: 'button',
          name: 'search',
          icon: 'search',
          onClick: 'dosamething'
        }, {
          type: 'button',
          name: 'save',
          text: '保存'
        }]
      }, {
        type: 'voucher',
        layout: 'list',
        text: 'header 1',
        items: [{
          type: 'decimal',
          text: 'item1',
          value: '$item1',
          onChange: 'action1'
        }, {
          type: 'decimal',
          text: 'item2',
          value: '$item1+1'
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
      }]
    });
    //console.log(JSON.stringify(s,null,2));
    const v = UIStore.create(s, {
      item1: 1000.00
    }).ui;
    // navbar
    expect(v.containers[0]).to.be.a.instanceof(Container);
    expect(v.containers[0].text).to.be.equal('this is title');
    expect(v.containers[0].type).to.be.equal('navbar');
    expect(v.containers[0].items.length).to.be.equal(2);
    expect(v.containers[0].items[0].onClick.name).to.be.equal('dosamething');

    // voucher
    console.log(v.containers[1])
    expect(v.containers[1]).to.be.a.instanceof(Form);
    expect(v.containers[1].items.length).to.be.equal(1);
    expect(v.containers[1].onLoad.args.item1).to.be.equal(100);
    expect(v.containers[1].onLoad.args.item2).to.be.equal(2000);
    expect(v.containers[1].onAfterLoad.length).to.be.equal(2);
    expect(v.containers[1].onAfterLoad[1].name).to.be.equal('loaded2');

    // container
    expect(v.containers[1].items[0]).to.be.a.instanceof(Container);
    expect(v.containers[1].items[0].layout).to.be.a.instanceof('list');
    expect(v.containers[1].items[0].items.length).to.be.equal(1);
    expect(v.containers[1].items[0].text).to.be.equal('header 1');

    // formitem
    expect(v.containers[1].items[0].items.length).to.be.equal(2);
    expect(v.containers[1].items[0].items[0]).to.be.a.instanceof(FormItem);
    expect(v.containers[1].items[0].items[1]).to.be.a.instanceof(FormItem);

    // input
    expect(v.containers[1].items[0].items[0].inputItem).to.be.a.instanceof(Input);
    expect(v.containers[1].items[0].items[1].inputItem).to.be.a.instanceof(Input);
    expect(v.containers[1].items[0].items[0].inputItem.type).to.be.equal('number');
    expect(v.containers[1].items[0].items[0].inputItem.placeholder).to.be.equal(undefined);
    expect(v.containers[1].items[0].items[0].inputItem.clear).to.be.equal(false);
    expect(v.containers[1].items[0].items[0].inputItem.editable).to.be.equal(true);
    expect(v.containers[1].items[0].items[0].inputItem.disabled).to.be.equal(false);
    expect(v.containers[1].items[0].items[0].inputItem.maxLength).to.be.equal(undefined);
    expect(v.containers[1].items[0].items[0].inputItem.labelNumber).to.be.equal(undefined);
    expect(v.containers[1].items[0].items[0].inputItem.defaultValue).to.be.equal(undefined);
    expect(v.containers[1].items[0].items[0].inputItem.error).to.be.equal(true);
    expect(v.containers[1].items[0].items[0].inputItem.extra).to.be.equal(undefined);
    expect(v.containers[1].items[0].items[0].inputItem.text).to.be.equal('item1');
    expect(v.containers[1].items[0].items[0].inputItem.value).to.be.equal(1000.00);
    expect(v.containers[1].items[0].items[0].inputItem.onChange.name).to.be.equal('action1');
    expect(v.containers[1].items[0].items[0].inputItem.onBeforeChange).to.be.equal(null);
    expect(v.containers[1].items[0].items[0].inputItem.onAfterChange).to.be.equal(null);
    expect(v.containers[1].items[0].items[0].inputItem.onBlur).to.be.equal(null);
    expect(v.containers[1].items[0].items[0].inputItem.onFocus).to.be.equal(null);
    expect(v.containers[1].items[0].items[0].inputItem.onErrorClick).to.be.equal(null);
    expect(v.containers[1].items[0].items[0].inputItem.onExtraClick).to.be.equal(null);

  })

  it('数据的定义也可是一个数组中的第一个元素', () => {
    const v = UIStore.create(UIStore.createSchema({
      type: 'voucher',
      items: {
        text: 'header 1',
        items: [{
          type: 'decimal',
          text: 'item1',
          value: '$item1',
          onChange: 'action1'
        }, {
          type: 'decimal',
          text: 'item2',
          value: '$item1+1'
        }]
      }
    }), {}).ui;

    // voucher
    expect(v.containers[0]).to.be.a.instanceof(Container);
    expect(v.containers[0].items.length).to.be.equal(1);

    // list
    expect(v.containers[0].items[0]).to.be.a.instanceof(Container);
    expect(v.containers[0].items[0].text).to.be.equal('header 1');
    expect(v.containers[0].items[0].items.length).to.be.equal(2);
    expect(v.containers[0].items[0].items[0]).to.be.a.instanceof(Input);
    expect(v.containers[0].items[0].items[1]).to.be.a.instanceof(Input);

    // input
    expect(v.containers[0].items[0].items[0].type).to.be.equal('number');

  })

  it('Schema支持jxon格式', () => {
    const strxml = "<view>\
      <navbar text='this is title'>\
        <item name='search' icon='search' onClick='search'/>\
        <item name='save' text='保存' icon='check' onClick='save1'/>\
        <item name='action1' text='action 1' />\
        <item name='action2' text='action 2'  />\
      </navbar>\
      <!--- 这是注释 -->\
      <voucher state='$state' onLoaded='loadVoucher'>\
        <list text='\"header \"+$state'>\
          <item type='decimal' value='item1' text='item 1'/>\
          <item type='decimal' value='item2' text='item 2'/>\
        </list>\
      </voucher>\
    </view>";
    const s = UIStore.loadJxon(strxml)
    const jx = s.items.items;
    //console.log(JSON.stringify(jx, null, 2))

    expect(jx.length).to.be.equal(2);
    expect(jx[0].type).to.be.equal('nav');
    expect(jx[0].text).to.be.equal('this is title');

    expect(jx[0].items.length).to.be.equal(4);
    expect(jx[0].items[1].name).to.be.equal('save');
    expect(jx[0].items[1].text).to.be.equal('保存');
    expect(jx[0].items[1].icon).to.be.equal('check');
    expect(jx[0].items[1].onClick).to.be.equal('save1');

    expect(jx[1].items.items[0].type).to.be.equal('number');
    expect(jx[1].items.items[0].text).to.be.equal('item 1');

  })
})
