import nools from 'nools';
import api from './api';
import feedback from './feedback';
import EventModel from './EventModel';
import ViewModel from './MetaVM';

let gid = 0;

// 分配全局id
const assignId = () => {
  // 每次加一
  gid = gid + 1;
  return gid;
}

export default class RuleSet {
  flow;
  name;

  constructor(name, noolsSource = [], define, scope) {
    name = name || assignId();
    this.name = 'RuleSet' + name;
    this.flow = nools.compile(noolsSource.join('\n'), {
      define: {
        // UIModel, // 禁用，都应该用业务模型控制
        EventModel,
        // 业务模型
        ViewModel, // store是从vm继承的所以vm就是store
        ...define
      },
      scope: {
        t: api.i18n.getFixedT(null, 'domains/' + name),
        ...api,
        ...feedback,
        ...scope
      },
      name: this.name
    });
  }

  execute(facts) {
    const session = this.flow.getSession(...facts);
    return session.match(() => {
      session.dispose();
    });
  }

  dispose() {
    nools.deleteFlow(this.name);
    this.flow = null;
  }
}
