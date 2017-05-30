import * as _ from 'lodash';
import * as moment from 'moment';
import { PickerColumn } from 'ionic-angular';

import { MultiPickerTypeTime } from '../../../../src/components/multi-picker/types/time';
import { MultiPickerColumn } from '../../../../src/components/multi-picker/multi-picker-columns';
import { IMultiPickerTypeTimeColumns } from '../../../../src/components/multi-picker/multi-picker-types';
import { MultiPickerColumnMinutes } from '../../../../src/components/multi-picker/columns/minutes';
import { MultiPickerColumnHours } from '../../../../src/components/multi-picker/columns/hours';
import { MultiPickerColumnNoon } from '../../../../src/components/multi-picker/columns/noon';
import { MultiPickerUtils } from '../../../../src/util';

describe('MultiPickerTypeTime', () => {
  beforeEach(()=> {
    this.typeAttrs = {
      min: '2005-08-09T18:31:42',
      max: '2091-11-15T14:13:23',
      minuteRounding: '6'
    };
    this.newInstance = ()=>  new MultiPickerTypeTime(this.typeAttrs);
    this.type = this.newInstance();
  });

  describe ('constructor', ()=> {
    fit('should parse format from defaultFormat', () => {
      expect(this.type.format).toEqual(MultiPickerColumn.defaultFormat)
    });

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
    const rouded = time => MultiPickerUtils.minuteRound(moment(time), this.type.minuteRounding).toObject();
    const omit = obj => _.omit(obj, ['milliseconds']);

    it('should return moment object of current time if picker value is empty', () => {
      const defaultMoment = omit(this.type.defaultMoment(''));
      expect(defaultMoment).toEqual(omit(rouded(undefined)));
      expect(defaultMoment).toEqual(omit(this.type.defaultMoment()))
    });

    it('should return moment object of string', () => {
      const pickerValue = '2017-01-24T14:38:42';
      expect(omit(this.type.defaultMoment(pickerValue))).toEqual(omit(rouded(pickerValue)));
    });

    it('should return moment object of min', () => {
      const pickerValue = '2000-01-24T14:38:42';
      expect(omit(this.type.defaultMoment(pickerValue))).toEqual(omit(rouded(this.type.min)));
    });

    it('should return moment object of max', () => {
      const pickerValue = '2101-01-24T14:38:42';
      expect(omit(this.type.defaultMoment(pickerValue))).toEqual(omit(rouded(this.type.max)));
    });

    it('should return moment object with noon as 0 or 1', ()=> {
      this.type.format.is12 = true;
      const check = (pickerValue, noon) => {
        expect(omit(this.type.defaultMoment(pickerValue))).toEqual(_.merge(omit(rouded(pickerValue)), {noon: noon}));
      };
      check('2017-01-24T09:38:42', 0);
      check('2017-01-24T19:38:42', 1);
    })
  });

  describe('#defaultMoment', () => {
    it('should change format pattern attribute', () => {
      expect(this.type.format.pickerFormat).toEqual('');
      this.type.parseFormat('HH:mm');
      expect(this.type.format.pickerFormat).toEqual('HH:mm');
    });

    it('should change format hours and is12 attribute when format is 12-hours and there is no "A"', () => {
      expect(this.type.format.is12).toBeFalsy();
      expect(this.type.format.hours).toEqual(24);
      this.type.parseFormat('h:m');
      expect(this.type.format.is12).toBeTruthy();
      expect(this.type.format.hours).toEqual(12);
    });

    it('should upper format noons attribute when format is 12-hours and there is "A"', () => {
      expect(this.type.format.noons).toEqual(['am', 'pm']);
      this.type.parseFormat('h:m A');
      expect(this.type.format.noons).toEqual(['AM', 'PM']);
    })
  })
});
