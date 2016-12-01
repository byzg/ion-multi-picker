import _ from 'lodash';

import { MultiPickerColumn, IMultiPickerColumn, IColumnAttrs } from '../multi-picker-columns';

export class MultiPickerColumnHours extends MultiPickerColumn implements IMultiPickerColumn {
  minHour = this.min.hour();
  maxHour = this.max.hour();
  existingHours: Object = {};

  name = 'hour';
  firstOptionValue = this.minHour;
  lastOptionValue =  this.maxHour;

  filter(noon: number): Array<number> {
    return this.filterMeridiem(noon).values
  }

  filterMeridiem(noon): MultiPickerColumnHours {
    if (!this.format.is12) return this;
    if (!this.existingHours[noon]) {
      this.generateOptions();
      this.existingHours[noon] = _.filter(this.values, (hour)=> {
        return _.max([noon * 12, this.minHour]) <= hour && hour <= _.min([(noon + 1) * 12, this.maxHour])
      });
      this.existingHours[noon] = super.toOptions(this.existingHours[noon]);
    }
    this.options = this.existingHours[noon];
    return this
  }

  protected optionText(num: number, attrs: Object = {}): string {
    if (!this.format.is12) return `${num}`;
    let hourIn12 = num % 12;
    return _.padStart(`${hourIn12 == 0 ? 12 : hourIn12}`, 2, '0')
  }
}
