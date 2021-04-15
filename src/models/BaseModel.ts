import { observable, computed, action, toJS, when } from 'mobx';
import { Expression } from '../expr';

enum ValidateResult {
  none,
  success,
  error,
}

export interface SetOptions {
  // 是否来源ui触发修改，用来控制async事件发生的顺序
  fromUI?: boolean;
  // 是否是数据字段，不是UI属性
  isDataField?: boolean;
}

interface EventItem {
  model: DataModel;
  eventName: string;
  params: any;
  resolve?: () => void;
  reject?: (err) => void;
}

// 当前事件链
const deadlock = [];
// 事件执行前快照
let snapshoot;
// 事件堆栈，保证UI事件不要同时执行，先放stock里
const eventStock: EventItem[] = [];

// 死循环异常
export class DeadLockError extends Error { }

export class DataModel {
  @observable protected props = observable.map<string, any>({});

  protected dataProps = new Set<string>();

  private events: {
    [key: string]: Array<{ handle: Function; bindVM: Function, scope: any }>;
  } = {};

  protected cache = {};

  afterInit: Function;

  get(key: string) {
    const val = this.props.get(key);
    if (key + 'Expr' in this.cache || this.isExpr(val)) {
      let expr = this.cache[key + 'Expr'];
      if (!expr) {
        expr = new Expression(val);
        this.cache[key + 'Expr'] = expr;
      }
      return expr.exec({
        viewModel: this.parent,
      });
    } else {
      return val;
    }
  }

  has(key: string) {
    return this.props.has(key);
  }

  @action async set(key: string, value, options: SetOptions = {}) {
    if (options.isDataField) {
      this.dataProps.add(key);
    }
    const oldValue = this.props.get(key);
    if (this.get('type') === 'enum' && value && oldValue ? value.id === oldValue.id : oldValue === value) {
      return;
    }
    if (!this.isExpr(value) && key + 'Expr' in this.cache) {
      delete this.cache[key + 'Expr'];
    }
    this.props.set(key, value);
    try {
      // 这里需要保证事件执行顺序所以加了await，导致了组件刷新频率增高，最外层的action没有用了
      // 要是不同步等待会使  事件在业务逻辑后执行
      // 导致第一业务判断错误，延后没有及时计算
      // 第二业务事件死锁无法判断
      await this.fire(key + 'Changed', { oldValue, value, key, ...options });
    } catch (err) {
      // 事件循环终止
      if (!(err instanceof DeadLockError)) {
        throw err;
      }
    }
  }

  hasData(key): Boolean {
    return this.dataProps.has(key);
  }

  protected isExpr(value) {
    return typeof value === 'string' && value.indexOf('$') > -1;
  }

  get name(): string {
    return this.cache['name'];
  }

  get parent(): DataModel {
    // parent 不支持表达式
    return this.cache['parent'];
  }

  @computed get value() {
    return toJS(this.get('value'));
  }

  @computed get data() {
    return this.get('value');
  }

  get isDirty(): boolean {
    return this.props.get('isDirty');
  }

  @computed get readOnly(): boolean {
    return this.get('readOnly');
  }

  @computed get disabled(): boolean {
    return this.get('disabled');
  }

  @computed get visible(): boolean {
    return this.get('visible');
  }

  get checking(): boolean {
    return this.props.get('checking');
  }

  get checkMsg() {
    return this.props.get('checkMsg');
  }

  get validateResult(): ValidateResult {
    return this.props.get('validate');
  }

  get validateMsg() {
    return this.props.get('validateMsg');
  }

  async setValidateMsg(msgs) {
    await this.set('validateMsg', msgs);
  }

  set name(name) {
    this.cache['name'] = name;
  }

  set parent(parent) {
    this.cache['parent'] = parent;
  }

  async setValue(value, options?: SetOptions) {
    await this.set('value', value, options);
  }

  async setVisible(visible) {
    await this.set('visible', visible);
  }

  // 等待关闭隐藏
  whenVisible(visible): Promise<void> {
    return new Promise((resolve, reject) => {
      when(() => this.visible === visible, resolve)
    })
  }

  async setDisabled(disabled) {
    if (!this.get('canModify')) {
      return;
    }
    await this.set('disabled', disabled);
  }

  async setReadOnly(readOnly) {
    if (!this.props.get('canModify')) {
      return;
    }
    await this.set('readOnly', readOnly);
  }

  async setData(value, options?: SetOptions) {
    await this.setValue(value, options);
    // 支持相同boField的数据字段自动同步更新机制
    if (this.parent) {
      await this.parent.sync(this, value);
    }
  }

  isSyncing = false;

  @action async sync(src: DataModel, value) {
    if (this.isSyncing) {
      return;
    }
    this.isSyncing = true;
    try {
      if ((!src.get('boField') && !src.get('childField')) || !src.get('bo')) {
        return;
      }
      // 只有containerModel支持
      for (const key of this.dataProps) {
        const dataField: DataModel = this.get(key);
        if (
          dataField !== src &&
          dataField.get('bo') === src.get('bo') &&
          ((src.get('boField') &&
            dataField.get('boField') === src.get('boField')) ||
            (src.get('childField') &&
              dataField.get('childField') === src.get('childField')))
        ) {
          await dataField.setData(value);
        }
      }
    } finally {
      this.isSyncing = false;
    }
  }

  async setIsDirty(dirty) {
    if (dirty) {
      await this.set('isDirty', true);
      return;
    }
    await this.set('isDirty', false);
    await this.set('originalValue', this.value);
  }

  constructor({ name, ...data }) {
    this.name = name;
    this.props.merge({
      visible: data ? data.hidden !== true : true,
      disabled: false,
      readOnly: false,
      isDirty: false,
      ...data,
    });
  }

  getDirtyData(necessary = true) {
    var value = this.data;
    if (
      necessary !== false &&
      (this.get('isDirty') || this.get('defaultValue') != null)
    )
      return value;
    if (value === this.get('originalData')) return;
    return value;
  }

  @action async validate(cancel = true): Promise<Boolean> {
    // todo
    return true;
  }

  @action gc() {
    this.props.clear();
  }

  @action clear(useDefault = true) {
    // 基类不需要处理
  }

  on(
    name: string,
    callback: (params?, scope?) => boolean | void | Promise<boolean | void>,
    scope?
  ) {
    let handlers = this.events[name];
    if (handlers) {
      if (handlers.some((it) => it.handle === callback)) {
        return;
      }
    } else {
      handlers = [];
      this.events[name] = handlers;
    }
    handlers.push({
      handle: callback,
      bindVM: callback.bind(this.parent || this),
      scope,
    });
  }

  un(
    name: string,
    callback: (params?, scope?) => boolean | void | Promise<boolean | void>
  ) {
    const handlers = this.events[name] || [];
    const item = handlers.find((it) => it.handle === callback);
    if (!item) {
      return;
    }
    handlers.splice(handlers.indexOf(item), 1);
  }

  hasEvent(
    name: string,
    callback: (params?, scope?) => boolean | void
  ): Boolean {
    const handlers = this.events[name] || [];
    const item = handlers.find((it) => it.handle === callback);
    return !item;
  }

  // 恢复挂起的事件执行
  private resumeEvent() {
    const evt = eventStock.splice(0, 1)[0];
    if (evt) {
      evt.model
        .fire(evt.eventName, evt.params)
        .then(() => {
          evt.resolve();
        })
        .catch((err) => {
          evt.reject(err);
        });
    }
  }

  // 挂起当前事件等之前的事件执行完了再执行
  private suspendEvent(eventName: string, params) {
    const evt = {
      model: this,
      eventName,
      params,
      resolve: null,
      reject: null,
    };
    // 挂起这个新事件
    eventStock.push(evt);
    return new Promise((resolve, reject) => {
      evt.resolve = resolve;
      evt.reject = reject;
    });
  }

  async fire(eventName, params: { [key: string]: any } = {}) {
    // 防止同时执行多个UI触发的异步事件，保证业务顺序发生，业务开发简单好理解
    // 暂时没有好的办法判断只能给UI的fire都加个参数
    if (
      (params.fromUI === true ||
        // 要是业务逻辑触发的click时fromUI需要设置false
        ((eventName === 'click' ||
          eventName === 'focus' ||
          eventName === 'blur') &&
          params.fromUI !== false)) &&
      deadlock.length > 0
    ) {
      return this.suspendEvent(eventName, params);
    }
    // 增加死锁检查，业务可以随便写，不用自己处理循环问题
    // 支持这样写：A=B+1 => B=A+1 不会循环触发A的再次计算
    if (params.key || params.index) {
      const path =
        (this.name ? this.name + '.' : '') + (params.key || params.index);
      if (deadlock.indexOf(path) === -1) {
        snapshoot = this.parent ? this.parent.toJS() : this.toJS();
        deadlock.push(path);
      } else {
        // 发生死锁恢复快照
        this.parent && snapshoot
          ? this.parent.fromJS(snapshoot)
          : this.fromJS(snapshoot);
        // log
        const errmsg = deadlock.join('->') + '->' + path;
        console.warn('dead locak rollback!', errmsg);
        // 终止执行
        throw new DeadLockError('dead lock ' + errmsg);
      }
    }
    // 执行
    const camelName =
      eventName.substr(0, 1).toUpperCase() + eventName.substr(1);
    // console.log('=> fire event ' + eventName + '...');
    if (!(await this.execute('before' + camelName, params))) {
      // console.log('fire event ' + 'before' + camelName + ' end.');
      deadlock.pop();
      // 当前事件执行完了恢复挂起的事件执行
      deadlock.length === 0 && this.resumeEvent();
      return;
    }
    // 增加一个全局事件
    if (this.parent) {
      if (
        !(await this.parent.execute('beforeEvent', {
          eventName,
          key: this.name,
          params,
        }))
      ) {
        deadlock.pop();
        deadlock.length === 0 && this.resumeEvent();
        return;
      }
    }
    if (!(await this.execute(eventName, params))) {
      // console.log('fire event ' + eventName + ' end.');
      deadlock.pop();
      deadlock.length === 0 && this.resumeEvent();
      return;
    }
    if (this.parent) {
      if (
        !(await this.parent.execute('event', {
          eventName,
          key: this.name,
          params,
        }))
      ) {
        deadlock.pop();
        deadlock.length === 0 && this.resumeEvent();
        return;
      }
    }
    if (!(await this.execute('after' + camelName, params))) {
      deadlock.pop();
      deadlock.length === 0 && this.resumeEvent();
      return;
    }
    if (this.parent) {
      if (
        !(await this.parent.execute('afterEvent', {
          eventName,
          key: this.name,
          params,
        }))
      ) {
        deadlock.pop();
        deadlock.length === 0 && this.resumeEvent();
        return;
      }
    }
    deadlock.pop();
    deadlock.length === 0 && this.resumeEvent();
    // console.log('<= fire event ' + eventName + ' end.');
  }

  async execute(name, params): Promise<Boolean> {
    let result = true;
    const handlers = this.events[name] || [];
    for (const { bindVM: handle, scope } of handlers) {
      try {
        console.log(name + ' execute...', params);
        result = (await handle({ ...scope, ...params }, this)) !== false;
      } catch (e) {
        result = false;
        console.error('execute[' + name + '] exception: ' + e.stack);
      }
      if (result === false) {
        console.log(name + ' execute canceled!');
        break;
      }
    }
    // 增加一种类似dom事件冒泡机制
    // if (result && this.parent) {
    //   console.log(name + ' popup...');
    //   result = await this.parent.execute(name, params);
    //   console.log(name + ' popup end.');
    // }
    // console.log(name + ' execute end.');
    return result;
  }

  @action fromJS(data) {
    for (const key of this.props.keys()) {
      const it = this.props.get(key);
      if (it instanceof DataModel && !(it === this.parent)) {
        it.fromJS(data[key]);
      } else {
        this.props.set(key, data[key]);
      }
    }
    Object.keys(data).forEach((key) => {
      if (this.props.has(key)) {
        return;
      }
      // todo 删除模型后再恢复不能恢复模型
      this.props.set(key, data[key]);
    });
  }

  toJS() {
    const data = {};
    for (const key of this.props.keys()) {
      const it = this.props.get(key);
      if (it instanceof DataModel && !(it === this.parent)) {
        data[key] = it.toJS();
      } else {
        data[key] = it;
      }
    }
    return data;
  }
}
