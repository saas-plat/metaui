const {
  expect
} = require('chai');
import {
  reaction
} from 'mobx';

import UIStore from '../src/UIStore';
import Model from '../src/models/Model';

describe('模型', () => {

  const store = new UIStore();

  it('模型支持动态属性', () => {
    const model = new Model(store, {
      name: 'n001',
      type: 'view',
      value: 100,
      subobj: {
        a: 10,
        b: 'bbbb'
      }
    });

    console.log(model)
    expect(model.name).to.be.eql('n001');
    expect(model.value).to.be.eql(100);
    expect(model.subobj.a).to.be.eql(10);
    expect(model.subobj.b).to.be.eql('bbbb');

    // 动态属性
    let a;
    reaction(() => model.visible, v => a = v);

    expect(model.visible).to.be.eql(undefined);
    expect(model.subobj.c).to.be.eql(undefined);

    model.visible = true;
    model.subobj.c = 'ccc';

    expect(model.visible).to.be.eql(true);
    expect(model.subobj.c).to.be.eql('ccc');

    // 动态属性也是可以观察的
    expect(a).to.be.eql(true)
  })

})
