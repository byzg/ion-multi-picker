import moment from 'moment';

import { MultiPickerColumn, IMultiPickerColumn } from '../multi-picker-columns';

export class MultiPickerColumnNoon extends MultiPickerColumn implements IMultiPickerColumn {
  name = 'noon';
  firstOptionValue = this.min.hour() > 11 ? 1 : 0;
  lastOptionValue = this.max.hour() > 11 ? 1 : 0;

  protected optionText(num: number): string {
    return this.format.noons[num]
  }
}
