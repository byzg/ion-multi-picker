import * as moment from 'moment';
import * as _ from 'lodash';

import { MultiPickerColumn, IMultiPickerColumn, IColumnAttrs } from '../multi-picker-columns';

export interface IColumnMonthsAttrs extends IColumnAttrs {
  pickerFormat: string;
}

export class MultiPickerColumnMonths extends MultiPickerColumn implements IMultiPickerColumn {
  name = 'months';
  lastOptionValue = 12;
  pickerFormat: string = MultiPickerColumn.defaultFormat.pickerFormat;
  constructor(attrs?: IColumnMonthsAttrs) {
    super(attrs);
    _.merge(this, attrs);
    this.parseFormat()
  }

  protected optionText(num: number): string {
    return moment().month(num - 1).format(this.pickerFormat)
  }

  private parseFormat() {
    this.pickerFormat = this.pickerFormat.match(/M/)[0]
  }
}
