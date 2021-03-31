import { computed, action } from 'mobx';
import { DataModel } from './BaseModel';

export class SimpleModel extends DataModel {
  async clear(useDefault = true) {
    if (useDefault === false) {
      await this.setValue(null);
      return;
    }
    var defaultValue = this.get('defaultValue');
    await this.setValue(defaultValue);
    if (defaultValue === null) return;
    await this.execute('afterValueChange', { value: defaultValue });
  }
}
