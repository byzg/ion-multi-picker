import moment from 'moment';
import { PickerColumn } from 'ionic-angular';

import { MultiPickerTypeTime } from '../../../../src/components/multi-picker/types/time';
import { IMultiPickerTypeTimeColumns } from '../../../../src/components/multi-picker/multi-picker-types';
import { MultiPickerColumnMinutes } from '../../../../src/components/multi-picker/columns/minutes';
import { MultiPickerColumnHours } from '../../../../src/components/multi-picker/columns/hours';
import { MultiPickerColumnNoon } from '../../../../src/components/multi-picker/columns/noon';

describe('MultiPickerTypeTime', () => {
  beforeEach(()=> {
    this.typeAttrs = {
      min: '2005-08-09T18:31:42',
      max: '2091-11-15T14:13:23',
      minuteRounding: '6',
      format: ''
    };
    this.newInstance = ()=>  new MultiPickerTypeTime(this.typeAttrs);
    this.type = this.newInstance();
  });

  describe ('constructor', ()=> {
    it('should correctly create columns objects', ()=> {
      const columns: IMultiPickerTypeTimeColumns = this.type.columns();
      expect(columns.minutesCol instanceof MultiPickerColumnMinutes).toBeTruthy();
      expect(columns.hoursCol instanceof MultiPickerColumnHours).toBeTruthy();
      expect(columns.noon).toEqual(undefined);
    });

    it('should create noon column if is12', ()=> {
      this.typeAttrs.format = 'h';
      const columns: IMultiPickerTypeTimeColumns = this.newInstance().columns();
      expect(columns.noon instanceof MultiPickerColumnNoon).toBeTruthy();
    });

    it('should correctly set attributes', () => {
      expect(moment(this.typeAttrs.min).isSame(this.type.min)).toBeTruthy();
      expect(moment(this.typeAttrs.max).isSame(this.type.max)).toBeTruthy();
      expect(parseInt(this.typeAttrs.minuteRounding)).toEqual(this.type.minuteRounding)
    });

    it('should call #generateOptions and #parseFormat', () => {
      spyOn(MultiPickerTypeTime.prototype, 'generateOptions').and.callThrough();
      spyOn(MultiPickerTypeTime.prototype, 'parseFormat').and.callThrough();
      this.newInstance();
      expect(this.type.generateOptions).toHaveBeenCalledTimes(1);
      expect(this.type.parseFormat).toHaveBeenCalledTimes(1);
    })
  });

  describe('#validate', () => {
    const columns: PickerColumn = { name: 'value' };
    beforeEach(()=> {
      spyOn(this.type, 'disableInvalid').and.returnValue('never mind');
    });

    it('should call #currentMoment and #disableInvalid', () => {
      spyOn(this.type, 'currentMoment').and.returnValue({hours: 91});
      const columns: PickerColumn = { name: 'value' };
      this.type.validate(columns, 'fakePickerValue');
      expect(this.type.currentMoment).toHaveBeenCalledWith(columns, 'fakePickerValue');
      expect(this.type.disableInvalid).toHaveBeenCalledWith(columns, 'minutesCol', 1, [91])
    });

    it('should call #disableInvalid for noon', () => {
      spyOn(this.type, 'currentMoment').and.returnValue({noon: 5});
      this.type.format.is12 = true;
      this.type.validate(columns, 'fakePickerValue');
      expect(this.type.disableInvalid).toHaveBeenCalledWith(columns, 'hoursCol', 0, [5])
    })
  });

  describe('#dealDoneVisibleBnt', () => {
    it('should be empty yet', () => {
      this.type.dealDoneVisibleBnt();
    })
  });

  describe('#defaultMoment', () => {
    it('should return moment object if picker value is empty', () => {
      this.type.dealDoneVisibleBnt();
    })
  });
});
