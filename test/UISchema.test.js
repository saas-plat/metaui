const chai = require('chai');
const expect = chai.expect;
const UISchema = require('../src/UISchema');

describe('UI Schema', () => {

  it('可以自定义UI模板', () => {
    const v = UISchema.loadJson({
      type: 'view',
      layout: 'topbottom',
      items: [{
        type: 'navbar',
        title: 'this is title',
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
        type: 'view',
        items: [{
          type: 'list',
          //layout: 'list',
          title: 'header 1',
          items: [{
            type: 'decimal',
            text: 'item1',
            value: '$item1',
            onChange: 'action1'
          }, {
            type: 'decimal',
            text: 'item2',
            value: '$item1'
          }]
        }]
      }]
    });

    // navbar
    //console.log(v)
    expect(v.items[0].title).to.be.equal('this is title');
    expect(v.items[0].type).to.be.equal('navbar');
    expect(v.items[0].items.length).to.be.equal(2);
    //console.log(v.items[0].items[0].onClick)
    expect(v.items[0].items[0].onClick.name).to.be.equal('dosamething');

    // voucher
    //console.log(v.items[1].onLoad.args)
    expect(v.items[1].items.length).to.be.equal(1);

    // container
    //expect(v.items[1].items[0].layout).to.be.equal('list');
    expect(v.items[1].items[0].title).to.be.equal('header 1');

    // formitem
    //console.log(v.items[1].items[0].items[0])
    expect(v.items[1].items[0].items.length).to.be.equal(2);

    // input
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
    expect(v.items[1].items[0].items[0].value).to.be.equal('$item1');
    //console.log(v.items[1].items[0].items[0].onChange)
    expect(v.items[1].items[0].items[0].onChange.name).to.be.equal('action1');

  })

  it('模板还支持xml格式', () => {
    const strxml = `<view>
      <navbar text='this is title'>
        <button name='search' icon='search' onClick='search'/>
        <button name='save' text='保存' icon='check' onClick='save1'/>
        <button name='action1' text='action 1' />
        <button name='action2' text='action 2'  />
      </navbar>
      <!--- 这是注释 -->
      <voucher state='$state' onLoaded='loadVoucher'>
        <list text='\"header \"+$state'>
          <formitem input='decimal' value='item1' text='item 1'/>
          <formitem input='decimal' value='item2' text='item 2'/>
        </list>
      </voucher>
    </view>`;
    let jx = UISchema.loadJxon(strxml)
    //console.log(jx)
    jx = jx.items;

    expect(jx.length).to.be.equal(2);
    expect(jx[0].type).to.be.equal('navbar');
    expect(jx[0].text).to.be.equal('this is title');

    expect(jx[0].items.length).to.be.equal(4);
    expect(jx[0].items[1].name).to.be.equal('save');
    expect(jx[0].items[1].text).to.be.equal('保存');
    expect(jx[0].items[1].icon).to.be.equal('check');
    expect(jx[0].items[1].onClick).to.be.equal('save1');

    expect(jx[1].items.items[0].input).to.be.equal('decimal');
    expect(jx[1].items.items[0].text).to.be.equal('item 1');

  })

})
