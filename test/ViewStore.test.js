import '../test.common';
import ViewStore  from '../../src/ViewStore';
import jxon from 'jxon';

describe('视图模板', () => {
  it('从Schema中加载视图模板', () => {
    const v = ViewStore.create([
      {
        type: 'nav',
        text: 'this is title',
        items: [
          {
            name: 'search',
            icon: 'search',
            onClick: 'dosamething'
          }, {
            name: 'save',
            text: '保存'
          }
        ]
      }, {
        type: 'voucher',
        items: [
          {
            headerText: 'header 1',
            items: [
              {
                type: 'money',
                text: 'item1',
                value: '$item1',
                onChange: 'action1'
              }, {
                type: 'money',
                text: 'item2',
                value: '$item1+1'
              }
            ]
          }
        ],
        onLoad: {
          name: 'loadVoucher',
          item1: 100,
          item2: '$item1+1000'
        },
        onLoaded: [
          {
            name: 'loaded1'
          }, {
            name: 'loaded2'
          }
        ]
      }
    ], {item1: 1000.00});

    //navbar
    expect(v.navbar.text).to.be.equal('this is title');
    expect(v.navbar.items.length).to.be.equal(2);
    expect(v.navbar.items[0].onClick.name).to.be.equal('dosamething');

    // voucher
    expect(v.main).to.be.a.instanceof(Voucher);
    expect(v.main.items.length).to.be.equal(1);

    // action test
    //console.log(v.main.onLoad.args)
    expect(v.main.onLoad.args.item1).to.be.equal(100);
    expect(v.main.onLoad.args.item2).to.be.equal(2000);
    expect(v.main.onLoaded.length).to.be.equal(2);
    expect(v.main.onLoaded[1].name).to.be.equal('loaded2');

    // list
    expect(v.main.items[0]).to.be.a.instanceof(List);
    expect(v.main.items[0].headerText).to.be.equal('header 1');
    expect(v.main.items[0].items.length).to.be.equal(2);
    expect(v.main.items[0].items[0]).to.be.a.instanceof(Input);
    expect(v.main.items[0].items[1]).to.be.a.instanceof(Input);

    // input
    expect(v.main.items[0].items[0].type).to.be.equal('money');
    expect(v.main.items[0].items[0].placeholder).to.be.equal(undefined);
    expect(v.main.items[0].items[0].clear).to.be.equal(false);
    expect(v.main.items[0].items[0].editable).to.be.equal(true);
    expect(v.main.items[0].items[0].disabled).to.be.equal(false);
    expect(v.main.items[0].items[0].maxLength).to.be.equal(undefined);
    expect(v.main.items[0].items[0].labelNumber).to.be.equal(undefined);
    expect(v.main.items[0].items[0].defaultValue).to.be.equal(undefined);
    expect(v.main.items[0].items[0].error).to.be.equal(true);
    expect(v.main.items[0].items[0].extra).to.be.equal(undefined);
    expect(v.main.items[0].items[0].text).to.be.equal('item1');
    expect(v.main.items[0].items[0].value).to.be.equal(1000.00);
    expect(v.main.items[0].items[0].onChange.name).to.be.equal('action1');
    expect(v.main.items[0].items[0].onBeforeChange).to.be.equal(null);
    expect(v.main.items[0].items[0].onAfterChange).to.be.equal(null);
    expect(v.main.items[0].items[0].onBlur).to.be.equal(null);
    expect(v.main.items[0].items[0].onFocus).to.be.equal(null);
    expect(v.main.items[0].items[0].onErrorClick).to.be.equal(null);
    expect(v.main.items[0].items[0].onExtraClick).to.be.equal(null);

  })

  it('数据的定义也可是一个数组中的第一个元素', () => {
    const v = ViewStore.create(
        {
        type: 'voucher',
        items:
          {
            headerText: 'header 1',
            items: [
              {
                type: 'money',
                text: 'item1',
                value: '$item1',
                onChange: 'action1'
              }, {
                type: 'money',
                text: 'item2',
                value: '$item1+1'
              }
            ]
          }
      }
    , { });



    // voucher
    expect(v.main).to.be.a.instanceof(Voucher);
    expect(v.main.items.length).to.be.equal(1);


    // list
    expect(v.main.items[0]).to.be.a.instanceof(List);
    expect(v.main.items[0].headerText).to.be.equal('header 1');
    expect(v.main.items[0].items.length).to.be.equal(2);
    expect(v.main.items[0].items[0]).to.be.a.instanceof(Input);
    expect(v.main.items[0].items[1]).to.be.a.instanceof(Input);

    // input
    expect(v.main.items[0].items[0].type).to.be.equal('money');


  })

  it('Schema支持jxon格式', () => {
    const strxml = "<view>\
      <nav text='this is title'>\
        <item name='search' icon='search' onClick='search'/>\
        <item name='save' text='保存' icon='check' onClick='save1'/>\
        <item name='action1' text='action 1' />\
        <item name='action2' text='action 2'  />\
      </nav>\
      <!--- 这是注释 -->\
      <voucher state='$state' onLoaded='loadVoucher'>\
        <list headerText='\"header \"+$state'>\
          <money value='item1' text='item 1'/>\
          <money value='item2' text='item 2'/>\
        </list>\
      </voucher>\
    </view>";
    jxon.config({
      valueKey: 'text',
      // attrKey: '$',
      attrPrefix: '',
      // lowerCaseTags: false,
      // trueIsEmpty: false,
      // autoDate: false,
      // ignorePrefixedNodes: false,
      // parseValues: false
    })

    const formatNode = (node) => {
      if (node.parentNode && node.nodeType === 1) {
        // 节点名称是type类型
        const attr = node.ownerDocument.createAttribute('type');
        attr.value = node.nodeName;
        node.setAttributeNode(attr);
        // 所有子节点都是items数组
        node.nodeName = 'items';
      }
      if (node.hasChildNodes()) {
        for (let i = 0; i < node.childNodes.length; i++) {
          formatNode(node.childNodes.item(i));
        }
      }
      return node;
    }

    var xml = jxon.stringToXml(strxml);
    formatNode(xml.documentElement);
    var jx = jxon.xmlToJs(xml).items.items;
    //console.log(JSON.stringify(jx, null, 2))

    expect(jx.length).to.be.equal(2);
    expect(jx[0].type).to.be.equal('nav');
    expect(jx[0].text).to.be.equal('this is title');

    expect(jx[0].items.length).to.be.equal(4);
    expect(jx[0].items[1].name).to.be.equal('save');
    expect(jx[0].items[1].text).to.be.equal('保存');
    expect(jx[0].items[1].icon).to.be.equal('check');
    expect(jx[0].items[1].onClick).to.be.equal('save1');

    expect(jx[1].items.items[0].type).to.be.equal('money');
    expect(jx[1].items.items[0].text).to.be.equal('item 1');

  })
})
