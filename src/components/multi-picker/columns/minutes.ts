import _ from 'lodash';
import moment from 'moment';
import { MultiPickerUtils } from '../../../util';

import { MultiPickerColumn, IMultiPickerColumn, IColumnAttrs } from '../multi-picker-columns';

export class MultiPickerColumnMinutes extends MultiPickerColumn implements IMultiPickerColumn {
  name = 'minutes';

  existingMinutes: Object = {};
  minHour: number = this.min.hour();
  minMinute: number = this.min.minute();
  maxHour: number = this.max.hour();
  maxMinute: number = this.max.minute();

  constructor(attrs: IColumnAttrs) {
    super(attrs);
    [this.firstOptionValue, this.lastOptionValue] = this.max.hour() > this.min.hour() ? [0, 59] : [this.minMinute, this.maxMinute];
  }

  get minuteRounding():number { return this.step }

  filter(hour: number): Array<number> {
    return this.filterLimits(hour).values
  }

  filterLimits(hour: number): MultiPickerColumnMinutes {
    if (!this.existingMinutes[hour]) {
      this.generateOptions();
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
    return MultiPickerUtils.minuteRound(val, this.minuteRounding)
  }

  protected optionText(num: number): string {
    return _.padStart(`${num}`, 2, '0')
  }
}
