import _ from 'lodash';
import moment from 'moment';
import { PickerColumn } from 'ionic-angular';

import { IMultiPickerTypeDateColumns, IMomentObject } from '../../../../src/components/multi-picker/multi-picker-types';
import { MultiPickerTypeDate } from '../../../../src/components/multi-picker/types/date';
import { MultiPickerColumnDays } from '../../../../src/components/multi-picker/columns/days';
import { MultiPickerColumnMonths } from '../../../../src/components/multi-picker/columns/months';
import { MultiPickerColumnYears } from '../../../../src/components/multi-picker/columns/years';

describe('MultiPickerTypeDate', () => {
  beforeEach(()=> {
    this.newInstance = ()=>  new MultiPickerTypeDate({});
    this.type = this.newInstance();
  });

  describe ('constructor', ()=> {
    it('should correctly create columns objects', ()=> {
      const columns: IMultiPickerTypeDateColumns = this.type.columns();
      expect(columns.daysCol instanceof MultiPickerColumnDays).toBeTruthy();
      expect(columns.monthsCol instanceof MultiPickerColumnMonths).toBeTruthy();
      expect(columns.yearsCol instanceof MultiPickerColumnYears).toBeTruthy();
    });

    it('should call #generateOptions', () => {
      spyOn(MultiPickerTypeDate.prototype, 'generateOptions').and.callThrough();
      this.newInstance();
      expect(this.type.generateOptions).toHaveBeenCalledTimes(1);
    })
  });

  describe('#validate', () => {
    it('should call #currentMoment and #disableInvalid', () => {
      spyOn(this.type, 'currentMoment').and.returnValue({months: 91, years: -14});
      spyOn(this.type, 'disableInvalid').and.returnValue('never mind');
      const columns: PickerColumn = { name: 'value' };
      this.type.validate(columns, 'fakePickerValue');
      expect(this.type.currentMoment).toHaveBeenCalledWith(columns, 'fakePickerValue');
      expect(this.type.disableInvalid).toHaveBeenCalledWith(columns, 'daysCol', 0, [91, -14])
    })
  });

  describe('#defaultMoment', () => {
    it('should parse string as moment', () => {
      const _momentObject = { years: 2005, months: 8, date: 9, hours: 18, minutes: 31, seconds: 42, milliseconds: 0 };
      expect(this.type.defaultMoment('2005-08-09T18:31:42')).toEqual(_momentObject)
    });

    it('should return now moment object when arg is empty', () => {
      const omit = obj => _.omit(obj, ['seconds', 'milliseconds']);
      const _momentObject: IMomentObject = omit(moment().toObject());
      _momentObject.months++;
      expect(omit(this.type.defaultMoment(''))).toEqual(_momentObject);
      expect(omit(this.type.defaultMoment())).toEqual(_momentObject);
      expect(omit(this.type.defaultMoment(null))).toEqual(_momentObject)
    })
  });
});
