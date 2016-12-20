import { MultiPickerColumn } from '../../../../src/components/multi-picker/multi-picker-columns';
import { MultiPickerColumnDays } from '../../../../src/components/multi-picker/columns/days';

describe('MultiPickerColumnHours', () => {
  beforeEach(() => {
    this.columnAttrs = {
    };
    this.newInstance = () => new MultiPickerColumnDays(this.columnAttrs);
    this.column = this.newInstance();
  });

  describe ('constructor', ()=> {
    it('should correctly sets default parameters', ()=> {
      expect(this.column.name).toEqual('date');
      expect(this.column.existingDates).toEqual({});
      expect(this.column.lastOptionValue).toEqual(31);
    });

    it('should parse weekends', ()=> {
      expect(this.newInstance().weekends).toEqual([]);

      this.columnAttrs.weekends = '2, 5 6 ,7';
      expect(this.newInstance().weekends).toEqual([2, 5, 6, 7]);

      this.columnAttrs.weekends = ['2', '5', 6, '7'];
      expect(this.newInstance().weekends).toEqual([2, 5, 6, 7])
    });
  });

  describe ('#customFilterDays', ()=> {
    const days = [4, 5, 8];
    const toOptionsResult = ['fake options'];
    const itBody = ()=> {
      let instance = this.newInstance();
      instance.options = days.map((day)=> { return {value: day} });
      spyOn(MultiPickerColumn.prototype, 'toOptions').and.returnValue(toOptionsResult);
      expect(instance.customFilterDays(3, 2016)).toBe(instance);
      expect(instance.options).toBe(toOptionsResult);
    };

    it('should should use lodash identity', ()=> {
      itBody();
      expect(MultiPickerColumn.prototype['toOptions']['calls'].argsFor(0)).toEqual([days])
    });

    it('should should use customFilterDays attribute function', ()=> {
      this.columnAttrs.customFilterDays = (days, month, year)=> days.filter(day=> day + month + year == 2024);
      spyOn(this.columnAttrs, 'customFilterDays').and.callThrough();
      itBody();
      expect(MultiPickerColumn.prototype['toOptions']['calls'].argsFor(0)).toEqual([[5]]);
      expect(this.columnAttrs.customFilterDays['calls'].argsFor(0)).toEqual([days, 3, 2016])
    });
  });

  describe ('#filter', ()=> {
    it('should call all filters as chain', ()=> {
      spyOn(this.column, 'filterDays').and.callThrough();
      spyOn(this.column, 'filterWeekends').and.callThrough();
      const customFilterDaysResult = {values: ['fakeValue']};
      spyOn(this.column, 'customFilterDays').and.returnValue(customFilterDaysResult);

      expect(this.column.filter(3, 2016)).toBe(customFilterDaysResult.values);

      expect(this.column.filterDays).toHaveBeenCalledWith(3, 2016);
      expect(this.column.filterWeekends).toHaveBeenCalledWith(3, 2016);
      expect(this.column.customFilterDays).toHaveBeenCalledWith(3, 2016)
    });
  });
});
