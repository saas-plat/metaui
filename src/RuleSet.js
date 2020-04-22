import nools from 'nools';

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

  constructor(noolsSource = [], define, scope) {
    this.name = 'RuleSet' + assignId();
    this.flow = nools.compile(noolsSource.join('\n'), {
      define,
      scope,
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
