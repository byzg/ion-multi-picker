import * as moment from 'moment';

export class SpecHelper {
  constructor(public spec: Object) {
  }

  static today(hours, minutes) {
    return moment().startOf('day').add({hours: hours, minutes: minutes})
  };
}
