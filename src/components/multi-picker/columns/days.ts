import _ from 'lodash';

import { MultiPickerColumn, IColumnAttrs } from '../multi-picker-columns';

export interface IColumnDaysAttrs extends IColumnAttrs {
  weekends: string|Array<string|number>;
  customFilterDays: Function;
}

export class MultiPickerColumnDays extends MultiPickerColumn {
  name = 'date';
  lastOptionValue = 31;

  weekends: Array<number>;
  customFilterDays: Function;
  existingDates: Object = {};

  constructor(attrs: IColumnDaysAttrs) {
    super(attrs);
    this.customFilterDays = (month: number, year: number): MultiPickerColumnDays => {
      let days = this.values;
      this.options = super.toOptions((attrs.customFilterDays || _.identity)(days, month, year));
      return this
    };

    if (typeof(attrs.weekends) == 'string')
      this.weekends = _.split(<string>attrs.weekends, /[\,\s]/g).map(weekend => parseInt(weekend));
    else if (this.weekends instanceof Array)
      this.weekends = _.map(this.weekends, weekend => typeof(weekend) == 'number' ? weekend : parseInt(weekend));
    else
      this.weekends = []
  }

  filter(month: number, year: number): Array<number> {
    return this.filterDays(month, year).filterWeekends(month, year).customFilterDays(month, year).values
  }

  filterDays(month: number, year: number): MultiPickerColumnDays {
    if (!this.existingDates[year] || ! this.existingDates[year][month]) {
      this.generateOptions();
      let lastMonthDay = super.toMoment(year, month, 1).endOf('month').date();
      let days = this.values;
      this.existingDates[year] = this.existingDates[year] || {};
      this.existingDates[year][month] = super.toOptions(_.filter(days, day => day <= lastMonthDay));
    }
    this.options = this.existingDates[year][month];
    return this
  }

  filterWeekends(month: number, year: number): MultiPickerColumnDays {
    let days = this.values;
    if (!_.isEmpty(this.weekends))
      this.options = super.toOptions(_.filter(days, day => {
        return !_.includes(this.weekends, super.toMoment(year, month, day).weekday())
      }));
    return this
  }
}
