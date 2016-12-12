import * as moment from 'moment';

export class MultiPickerUtils {
  static minuteRound(val: string|moment.Moment, rounding: number): moment.Moment {
    if (rounding == 1)
      return moment(val);
    else {
      const _moment = moment(val);
      const minuteTail = _moment.minute() % rounding;
      return _moment.subtract(minuteTail, 'minutes').set('second', 0);
    }
  }
}
