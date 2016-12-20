import * as _ from 'lodash';

import { SpecHelper } from '../../../spec_helper';
import { MultiPickerColumn } from '../../../../src/components/multi-picker/multi-picker-columns';
import { MultiPickerColumnHours } from '../../../../src/components/multi-picker/columns/hours';

describe('MultiPickerColumnHours', () => {
  beforeEach(()=> {
    this.columnAttrs = {
      min: SpecHelper.today(10, 5),
      max: SpecHelper.today(14, 3),
      format: _.extend({}, MultiPickerColumn.defaultFormat, {is12: true})
    };
    this.newInstance = ()=>  new MultiPickerColumnHours(this.columnAttrs);
    this.column = this.newInstance();
    this.instance =  this.column;
  });

  describe ('constructor', ()=> {
    it('should correctly sets default parameters', ()=> {
      expect(this.column.name).toEqual('hours');
      expect(this.column.existingHours).toEqual({});
      expect(this.column.minHour).toEqual(10);
      expect(this.column.maxHour).toEqual(14);
      expect(this.column.firstOptionValue).toEqual(10);
      expect(this.column.lastOptionValue).toEqual(14);
    });
  });

  describe('#optionText', ()=> {
    it('should just convert to string', ()=> {
      this.columnAttrs.format.is12 = false;
      expect(this.newInstance().optionText(7)).toEqual('7')
    });

    it('should return 12 if given hour is zero', ()=> {
      expect(this.newInstance().optionText(0)).toEqual('12')
    });

    it('should convert to string with leading zeros', ()=> {
      expect(this.newInstance().optionText(7)).toEqual('07')
    });
  });

  describe ('#filter', ()=> {
    it('should call #filterMeridiem', ()=> {
      let filterMeridiemResults = {values: ['fakeValue']};
      spyOn(this.column, 'filterMeridiem').and.returnValue(filterMeridiemResults);
      expect(this.column.filter(3)).toBe(filterMeridiemResults.values);
      expect(this.column.filterMeridiem).toHaveBeenCalledWith(3)
    })
  });

  describe ('#filterMeridiem', ()=> {
    it('should just return itself if 24-hours format', ()=> {
      this.columnAttrs.format.is12 = false;
      let instance = this.newInstance();
      expect(instance.filterMeridiem(3)).toEqual(instance);
    });

    it('should read from existingHours if it is exist', ()=> {
      this.column.existingHours[3] = {fakeKey: 'fakeValue'};
      expect(this.column.filterMeridiem(3)).toBe(this.column);
      expect(this.column.options).toBe(this.column.existingHours[3]);
    });

    it('should filter before noon hours', ()=> {
      spyOn(this.column, 'generateOptions').and.callThrough();
      this.column.filterMeridiem(0);
      expect(this.column.existingHours[0]).toEqual([ { text: '10', value: 10 }, { text: '11', value: 11 } ]);
      expect(this.column.options).toBe(this.column.existingHours[0]);
      expect(this.column.generateOptions).toHaveBeenCalled()
    });

    it('should filter after noon noon hours', ()=> {
      spyOn(this.column, 'generateOptions').and.callThrough();
      this.column.filterMeridiem(1);
      expect(this.column.existingHours[1]).toEqual([
        { text: '12', value: 12 }, { text: '01', value: 13 }, { text: '02', value: 14 }
      ]);
      expect(this.column.options).toBe(this.column.existingHours[1]);
      expect(this.column.generateOptions).toHaveBeenCalled()
    });
  });
});
