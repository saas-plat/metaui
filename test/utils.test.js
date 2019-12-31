 const {
   expect
 } = require('chai');

 import {
   nano
 } from '../src/utils';

 describe('工具', () => {
   it('nano', () => {
     expect(nano('最大长度{{maxLength}}位', {
       maxLength: 255
     })).to.be.eql('最大长度255位')
   })
 });
