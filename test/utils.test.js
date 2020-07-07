 const {
   expect
 } = require('chai');

 import {
   t
 } from '../src/utils';

 require('i18next').init();

 describe('工具', () => {
   it('翻译', () => {
     expect(t('最大长度{{maxLength}}位', {
       maxLength: 255
     })).to.be.eql('最大长度255位')
   })
 });
