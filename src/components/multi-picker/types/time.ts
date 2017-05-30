import * as moment from 'moment';
import * as _ from 'lodash';
import { PickerColumn } from 'ionic-angular';

import { MultiPickerUtils } from '../../../util';
import { MultiPickerColumn, IColumnFormat } from '../multi-picker-columns';
import { MultiPickerType, IMultiPickerTypeTimeColumns, IMomentObject } from '../multi-picker-types';
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
    this.parseFormat(cmpAttrs.pickerFormat);
    this._columns = {
      hoursCol: new MultiPickerColumnHours({min: this.min, max: this.max, format: this.format}),
      minutesCol: new MultiPickerColumnMinutes({min: this.min, max: this.max, step: this.minuteRounding})
    };
    if (this.format.is12) this._columns.noon = new MultiPickerColumnNoon({min: this.min, max: this.max, format: this.format});
    this.generateOptions()
  }

  validate(columns: PickerColumn[], pickerValue?: string) {
    let currentMoment: IMomentObject = this.currentMoment(columns, pickerValue);
    this.disableInvalid(columns, 'minutesCol', 1, [currentMoment.hours]);
    if (this.format.is12)
      this.disableInvalid(columns, 'hoursCol', 0, [currentMoment.noon]);
  }

  dealDoneVisibleBnt(columns: PickerColumn[], button): void {}

  protected defaultMoment(pickerValue: string): IMomentObject {
    let defaultMoment: moment.Moment = pickerValue ? moment(pickerValue) : moment();
    if (this.min.isAfter(defaultMoment)) defaultMoment = this.min;
    if (this.max.isBefore(defaultMoment)) defaultMoment = this.max;
    defaultMoment = MultiPickerUtils.minuteRound(defaultMoment, this.minuteRounding);
    let defaultMomentObject: IMomentObject = defaultMoment.toObject();
    if (this.format.is12)
      defaultMomentObject.noon = defaultMomentObject.hours >= 12 ? 1 : 0;
    return defaultMomentObject
  }

  private parseFormat(pickerFormat: string): void {
    _.extend(this.format, {
      pickerFormat,
      is12: pickerFormat.includes('h'),
    });
    if (this.format.is12) {
      if (pickerFormat.includes('A')) this.format.noons = this.format.noons.map(_.upperCase);
      this.format.hours = 12
    }
  }
}
