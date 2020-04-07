import {
  computed,
  observable,
  extendObservable,
  action,
} from 'mobx';
import TableModel from './TableModel';


export default class TreeModel extends TableModel{
  // data = [
  //  {
  //    title: 'Node1',
  //    value: '0-0',
  //    key: '0-0',
  //    children: [    // <============ 子树
  //      {
  //        title: 'Child Node1',
  //        value: '0-0-1',
  //        key: '0-0-1',
  //      },
  //      {
  //        title: 'Child Node2',
  //        value: '0-0-2',
  //        key: '0-0-2',
  //      },
  //    ],
  //  },
  //  {
  //    title: 'Node2',
  //    value: '0-1',
  //    key: '0-1',
  //  },
  // ]
  constructor(store, {
    data = [],
    ...props
  }) {
    super(store, {
      data,
      ...props
    });
  }
}
