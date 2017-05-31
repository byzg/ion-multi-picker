import moment from 'moment';
import { PickerColumn } from 'ionic-angular';

import { MultiPickerType, IMultiPickerTypeDateColumns, IMomentObject } from '../multi-picker-types';
import { MultiPickerColumnDays } from '../columns/days';
import { MultiPickerColumnMonths } from '../columns/months';
import { MultiPickerColumnYears } from '../columns/years';

export class MultiPickerTypeDate extends MultiPickerType{
  protected _columns: IMultiPickerTypeDateColumns;
  constructor(cmpAttrs) {
    super();
    const { customFilterDays, weekends, pickerFormat } = cmpAttrs;
    this._columns = {
      daysCol: new MultiPickerColumnDays({ customFilterDays, weekends }),
      monthsCol: new MultiPickerColumnMonths({ pickerFormat }),
      yearsCol: new MultiPickerColumnYears({})
    };
    this.generateOptions()
  }

  validate(columns: PickerColumn[], pickerValue?: string) {
    let currentMoment: IMomentObject = this.currentMoment(columns, pickerValue);
    this.disableInvalid(columns, 'daysCol', 0, [currentMoment.months, currentMoment.years]);
  }

  protected defaultMoment(pickerValue: string): IMomentObject {
    let defaultMoment: IMomentObject;
    defaultMoment = (pickerValue ? moment(pickerValue) : moment()).toObject();
    defaultMoment.months++;
    return defaultMoment
  }
}
