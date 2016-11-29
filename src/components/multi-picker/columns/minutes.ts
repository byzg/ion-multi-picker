import _ from 'lodash';
import moment from 'moment';

import { MultiPickerColumn, IMultiPickerColumn } from '../multi-picker-options';

export class MultiPickerColumnMinutes extends MultiPickerColumn implements IMultiPickerColumn {
  existingMinutes: Object = {};
  min: moment.Moment;
  max: moment.Moment;
  minHour: number;
  minMinute: number;
  maxHour: number;
  maxMinute: number;
  minuteRounding: number;

  constructor(
    public name: string,
    protected firstOptionValue: number,
    protected lastOptionValue: number,
    min: moment.Moment|string,
    max: moment.Moment|string,
    minuteRounding: number|string
  ) {
    super(name, firstOptionValue, lastOptionValue, parseInt(<string>minuteRounding));
    this.min = moment(min);
    this.max = moment(max);
    this.minHour = this.min.hour();
    this.minMinute = this.min.minute();
    this.maxHour = this.max.hour();
    this.maxMinute = this.max.minute();
    this.minuteRounding = parseInt(<string>minuteRounding)
  }

  filter(hour: number): Array<number> {
    return this.filterLimits(hour).values
  }

  filterLimits(hour: number): MultiPickerColumnMinutes {
    if (!this.existingMinutes[hour]) {
      this.initOptions();
      let existingMinutes = this.values;
      if (hour < this.minHour || this.maxHour < hour)
        existingMinutes = [];
      else if (hour == this.minHour && this.minMinute != 0)
        existingMinutes = _.filter(this.values, minute => minute >= this.minMinute);
      else if (hour == this.maxHour && this.maxMinute != 59)
        existingMinutes = _.filter(this.values, minute => minute <= this.maxMinute);
      this.existingMinutes[hour] = super.toOptions(existingMinutes);
    }
    this.options = this.existingMinutes[hour];
    return this
  }

  round(val: string|moment.Moment): moment.Moment {
    if (this.minuteRounding == 1)
      return moment(val);
    else {
      const _moment = moment(val);
      const minuteTail = _moment.minute() % this.minuteRounding;
      return _moment.subtract(minuteTail, 'minutes').set('second', 0);
    }
  }

  protected optionText(num: number): string {
    return _.padStart(`${num}`, 2, '0')
  }
}
