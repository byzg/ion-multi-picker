import { SpecHelper } from '../../../spec_helper';
import { MultiPickerUtils } from '../../../../src/util';
import { MultiPickerColumnMinutes } from '../../../../src/components/multi-picker/columns/minutes';

describe('MultiPickerColumnMinutes', () => {
  beforeEach(()=> {
    this.columnAttrs = {
      min: SpecHelper.today(2, 5),
      max: SpecHelper.today(4, 3),
      step: 12
    };
    this.newInstance = ()=>  new MultiPickerColumnMinutes(this.columnAttrs);
    this.column = this.newInstance();
  });

  describe ('constructor', ()=> {
    it('should correctly sets default parameters', ()=> {
      expect(this.column.name).toEqual('minutes');
      expect(this.column.existingMinutes).toEqual({});
      expect(this.column.minHour).toEqual(2);
      expect(this.column.minMinute).toEqual(5);
      expect(this.column.maxHour).toEqual(4);
      expect(this.column.maxMinute).toEqual(3);
    });

    it('should sets first and last option values depends on max and min hours', ()=> {
      expect(this.newInstance().firstOptionValue).toEqual(0);
      expect(this.newInstance().lastOptionValue).toEqual(59);

      this.columnAttrs.max = SpecHelper.today(1, 7);
      expect(this.newInstance().firstOptionValue).toEqual(5);
      expect(this.newInstance().lastOptionValue).toEqual(7);
    })
  });

  describe ('#minuteRounding', ()=> {
    it('should returns step attribute', ()=> {
      expect(this.column.minuteRounding).toEqual(this.columnAttrs.step)
    })
  });

  describe ('#filter', ()=> {
    it('should call #filterLimits', ()=> {
      let filterLimitsResults = {values: ['fakeValue']};
      spyOn(this.column, 'filterLimits').and.returnValue(filterLimitsResults);
      expect(this.column.filter(27)).toBe(filterLimitsResults.values);
      expect(this.column.filterLimits).toHaveBeenCalledWith(27)
    })
  });

  describe ('#filterLimits', ()=> {
    it('should read from existingMinutes if it is exist', ()=> {
      this.column.existingMinutes[27] = {fakeKey: 'fakeValue'};
      expect(this.column.filterLimits(27)).toBe(this.column);
      expect(this.column.options).toBe(this.column.existingMinutes[27]);
    });

    describe('', ()=> {
      let fullGeneratedOptions = [
        { text: '00', value: 0 }, { text: '12', value: 12 }, { text: '24', value: 24 }, { text: '36', value: 36 },
        { text: '48', value: 48 }
      ];

      beforeEach(()=> {
        spyOn(this.column, 'generateOptions').and.callThrough();
      });

      afterEach(()=> {
        expect(this.column.generateOptions).toHaveBeenCalled()
      });

      it('should write options of empty array if given hour more than maxHour', ()=> {
        expect(this.column.existingMinutes).toEqual({});
        this.column.filterLimits(27);
        expect(this.column.existingMinutes[27]).toEqual([]);
        expect(this.column.options).toBe(this.column.existingMinutes[27]);
      });

      it('should write options of empty array if given hour less than minHour', ()=> {
        expect(this.column.existingMinutes[1]).toBe(undefined);
        this.column.filterLimits(1);
        expect(this.column.existingMinutes[1]).toEqual([]);
        expect(this.column.options).toBe(this.column.existingMinutes[1]);
      });

      it('should write filtered options if given hour is equal minHour and minMinute is not equal zero', ()=> {
        expect(this.column.existingMinutes[2]).toBe(undefined);
        this.column.filterLimits(2);
        expect(this.column.existingMinutes[2]).toEqual(fullGeneratedOptions.slice(1));
        expect(this.column.options).toBe(this.column.existingMinutes[2]);
      });

      it('should write filtered options if given hour is equal maxHour and maxMinute is not equal 59', ()=> {
        expect(this.column.existingMinutes[4]).toBe(undefined);
        this.column.filterLimits(4);
        expect(this.column.existingMinutes[4]).toEqual([ fullGeneratedOptions[0] ]);
        expect(this.column.options).toBe(this.column.existingMinutes[4]);
      });

      it('should write full generated options', ()=> {
        expect(this.column.existingMinutes[3]).toBe(undefined);
        this.column.filterLimits(3);
        expect(this.column.existingMinutes[3]).toEqual(fullGeneratedOptions);
        expect(this.column.options).toBe(this.column.existingMinutes[3]);
      });
    });
  });

  describe ('#round', ()=> {
    it('should call MultiPickerUtils.minuteRound', ()=> {
      spyOn(MultiPickerUtils, 'minuteRound').and.returnValue('fakeValue');
      expect(this.column.round(27)).toBe('fakeValue');
      expect(MultiPickerUtils.minuteRound).toHaveBeenCalledWith(27, 12)
    });
  })
});
