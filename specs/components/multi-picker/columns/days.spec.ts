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

  describe ('#filterDays', ()=> {
    let feb16Days = [
      { text: '1', value: 1 }, { text: '2', value: 2 }, { text: '3', value: 3 }, { text: '4', value: 4 },
      { text: '5', value: 5 }, { text: '6', value: 6 }, { text: '7', value: 7 }, { text: '8', value: 8 },
      { text: '9', value: 9 }, { text: '10', value: 10 }, { text: '11', value: 11 }, { text: '12', value: 12 },
      { text: '13', value: 13 }, { text: '14', value: 14 }, { text: '15', value: 15 }, { text: '16', value: 16 },
      { text: '17', value: 17 }, { text: '18', value: 18 }, { text: '19', value: 19 }, { text: '20', value: 20 },
      { text: '21', value: 21 }, { text: '22', value: 22 }, { text: '23', value: 23 }, { text: '24', value: 24 },
      { text: '25', value: 25 }, { text: '26', value: 26 }, { text: '27', value: 27 }, { text: '28', value: 28 },
      { text: '29', value: 29 }
    ];

    it('should read from existingDates if it is exist', ()=> {
      this.column.existingDates[2016] = {
        3: {fakeKey: 'fakeValue'}
      };
      expect(this.column.filterDays(3, 2016)).toBe(this.column);
      expect(this.column.options).toBe(this.column.existingDates[2016][3]);
    });

    it('should write days options for given month and given year', ()=> {
      spyOn(this.column, 'generateOptions').and.callThrough();
      this.column.filterDays(2, 2016);
      expect(this.column.existingDates[2016][2]).toEqual(feb16Days);
      expect(this.column.options).toBe(this.column.existingDates[2016][2]);
      expect(this.column.generateOptions).toHaveBeenCalled()
    });

    it('should write days options without weekends for given month (e.g: Feb-2016)', ()=> {
      this.column.filterDays(2, 2016);
      this.column.weekends = [6, 7];
      this.column.filterWeekends(2, 2016);
      expect(this.column.options).toEqual(feb16Days.filter(dayOption=> dayOption.value % 7 != 6 && dayOption.value % 7 != 0));
    });

    it('should just return itself if weekends is empty', ()=> {
      this.column.filterDays(2, 2016);
      spyOn(MultiPickerColumn.prototype, 'toOptions');
      expect(this.column.options).toEqual(feb16Days);
      this.column.weekends = [];
      this.column.filterWeekends(2, 2016);
      expect(this.column.options).toEqual(feb16Days);
      expect(MultiPickerColumn.prototype['toOptions']).toHaveBeenCalledTimes(0)
    })
  });

  describe ('#toMoment', ()=> {
    it('should return correct moment by year, month and day numbers', ()=> {
      let _moment = this.column.toMoment(2016, 3, 15);
      expect(_moment.format()).toEqual('2016-03-15T00:00:00+03:00')
    })
  })
});
