import * as _ from 'lodash';
import * as moment from 'moment';
import { PickerColumn } from 'ionic-angular';

import { MultiPickerColumn } from './multi-picker-columns';
import { MultiPickerColumnDays } from './columns/days';

export interface IMultiPickerTypeDateColumns {
  daysCol: MultiPickerColumnDays,
  monthsCol: MultiPickerColumn,
  yearsCol: MultiPickerColumn
}

export interface IMultiPickerTypeTimeColumns {
  hoursCol: MultiPickerColumn,
  minutesCol: MultiPickerColumn,
  noon?: MultiPickerColumn
}

export interface IMomentObject {
  years?: number,
  months?: number,
  date?: number,
  hours?: number,
  minutes?: number,
  noon?: number
}

export abstract class MultiPickerType {
  protected _columns: IMultiPickerTypeDateColumns |  IMultiPickerTypeTimeColumns;

  columns(): IMultiPickerTypeDateColumns |  IMultiPickerTypeTimeColumns {
    return this._columns
  }

  dealDoneVisibleBnt(columns: PickerColumn[], button): void {
    let isSomeDisabled = _.some(
      _.map(columns, (col, index) => col.options[col.selectedIndex].disabled)
    );
    button.cssRole = isSomeDisabled ? 'hide' : '';
  }

  setDefaultSelectedIndexes(columns: PickerColumn[], pickerValue: string): void {
    let defaultMoment = this.defaultMoment(pickerValue);
    _(columns).each((col) => {
      let index =  _.map(col.options, 'value').indexOf(defaultMoment[col.name]);
      col.selectedIndex = index < 0 ? 0 : index
    })
  }

  protected abstract defaultMoment(pickerValue: string): IMomentObject;

  protected currentMoment(columns: PickerColumn[], pickerValue: string): IMomentObject {
    let currentMoment: IMomentObject = {};
    if (typeof(pickerValue) == 'string' || moment.isMoment(pickerValue))
      currentMoment = this.defaultMoment(pickerValue);
    else
      columns.forEach(column => currentMoment[column.name] = column.options[column.selectedIndex].value);
    return currentMoment
  }

  protected generateOptions(): void {
    _.each(this._columns, (column)=> column.generateOptions())
  }

  protected someSelectedIndexBlank(columns: PickerColumn[]): boolean {
    return _.some(columns.map(col => {
      let isNumber = _.isNumber(col.selectedIndex);
      return !isNumber || isNumber && col.selectedIndex < 0
    }))
  }

  protected disableInvalid(columns: PickerColumn[], colName: string, pickerColIndex: number, rest: Array<number>): void {
    let allowed = this._columns[colName].filter(...rest);
    _(columns[pickerColIndex].options).each((option) => {
      option.disabled = !_(allowed).includes(option.value);
    });
  }
}
