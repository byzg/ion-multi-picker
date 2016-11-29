import moment from 'moment';
import _ from 'lodash';
import { PickerColumn } from 'ionic-angular';

import { MultiPickerColumn, IColumnFormat } from '../multi-picker-columns';
import { MultiPickerType, IMultiPickerTypeTimeColumns } from '../multi-picker-types';
import { MultiPickerColumnMinutes } from '../columns/minutes';
import { MultiPickerColumnHours } from '../columns/hours';
import { MultiPickerColumnNoon } from '../columns/noon';

export class MultiPickerTypeTime extends MultiPickerType{
  protected _columns: IMultiPickerTypeTimeColumns;
  private min: moment.Moment;
  private max: moment.Moment;
  private minuteRounding: number;
  private format: IColumnFormat = MultiPickerColumn.defaultFormat;
  constructor(cmpAttrs) {
    super();
    [this.min, this.max, this.minuteRounding] = [moment(cmpAttrs.min), moment(cmpAttrs.max), parseInt(cmpAttrs.minuteRounding)];
    this.parseFormat(cmpAttrs.format);
    this._columns = {
      hoursCol: new MultiPickerColumnHours({min: this.min, max: this.max, format: this.format}),
      minutesCol: new MultiPickerColumnMinutes({min: this.min, max: this.max, step: this.minuteRounding})
    };
    if (this.format.is12) this._columns.noon = new MultiPickerColumnNoon({format: this.format});
    this.generateOptions()
  }

  validate(columns: PickerColumn[]) {
    let hour: number;
    if (this.someSelectedIndexBlank(columns)) {
      let _moment: moment.Moment = moment();
      if (moment({hour: this.min.hour(), minute: this.min.minute()}).isAfter(_moment)) _moment = this.min;
      if (moment({hour: this.max.hour(), minute: this.max.minute()}).isBefore(_moment)) _moment = this.max;
      hour = _moment.hour();
      this.setDefaultSelectedIndexes(columns, [hour, _moment.minute()])
    } else {
      hour = columns[0].options[columns[0].selectedIndex].value;
    }
    this.disableInvalid(columns, 'minutesCol', 1, [hour])
  }

  dealDoneVisibleBnt(columns: PickerColumn[], button): void {}

  private parseFormat(pattern: string): void {
    _.extend(this.format, {
      pattern: pattern,
      is12: pattern.includes('h'),
    });
    if (this.format.is12) {
      if (pattern.includes('A')) this.format.noons = this.format.noons.map(_.upperCase);
      this.format.hours = 12
    }
  }
}
