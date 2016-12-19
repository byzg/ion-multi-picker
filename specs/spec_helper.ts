import * as moment from 'moment';

interface ISpecObject {
  instance: any,
  newInstance: Function
}

export class SpecHelper {
  constructor(public spec:ISpecObject) {
  }

  spyOnAndCallOriginal(method) {
    if (!this.spec.newInstance) throw 'spyOnAndCallOriginal: newInstance is required';
    if (!this.spec.instance) throw 'spyOnAndCallOriginal: instance is required';
    let original = this.spec.newInstance()[method].bind(this.spec.instance);
    spyOn(this.spec.instance, method).and.callFake((arg1, arg2)=> original(arg1, arg2));
  }

  today(hours, minutes) {
    return moment().startOf('day').add({hours: hours, minutes: minutes})
  };
}
