import moment from 'moment';
import _ from 'lodash';
import { PickerColumn } from 'ionic-angular';

import { MultiPickerType, IMultiPickerTypeDateColumns } from '../multi-picker-types';
import { MultiPickerColumnDays } from '../columns/days';
import { MultiPickerColumnMonths } from '../columns/months';
import { MultiPickerColumnYears } from '../columns/years';

export class MultiPickerTypeDate extends MultiPickerType{
  protected _columns: IMultiPickerTypeDateColumns;
  constructor(cmpAttrs) {
    super();
    this._columns = {
      daysCol: new MultiPickerColumnDays({customFilterDays: cmpAttrs.customFilterDays, weekends: cmpAttrs.weekends}),
      monthsCol: new MultiPickerColumnMonths({}),
      yearsCol: new MultiPickerColumnYears({})
    };
    this.generateOptions()
  }

  validate(columns: PickerColumn[]) {
    let month: number, year: number;
    if (this.someSelectedIndexBlank(columns)) {
      const _moment = moment();
      [month, year] = [_moment.month() + 1, _moment.year()];
      this.setDefaultSelectedIndexes(columns, [_moment.date(), month, year]);
    } else {
      [month, year] = _.map([1, 2], numCol => parseInt(columns[numCol].options[columns[numCol].selectedIndex].value));
    }
    this.disableInvalid(columns, 'daysCol', 0, [month, year])
  }
}
