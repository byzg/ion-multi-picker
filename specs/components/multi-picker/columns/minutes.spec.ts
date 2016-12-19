import * as moment from 'moment';

import { MultiPickerColumnMinutes } from '../../../../src/components/multi-picker/columns/minutes';

describe('MultiPickerColumnMonths', () => {
  let today = (hours, minutes)=> {
    return moment().startOf('day').add({hours: hours, minutes: minutes})
  };

  beforeEach(()=> {
    this.columnAttrs = {
      min: today(1, 4),
      max: today(3, 2)
    };
    this.newInstance = ()=>  new MultiPickerColumnMinutes(this.columnAttrs);
    this.column = this.newInstance();
  });

  describe ('constructor', ()=> {
    it('should correctly sets default parameters', ()=> {
      expect(this.column.name).toEqual('minutes');
      expect(this.column.existingMinutes).toEqual({});
      expect(this.column.minHour).toEqual(1);
      expect(this.column.minMinute).toEqual(4);
      expect(this.column.maxHour).toEqual(3);
      expect(this.column.maxMinute).toEqual(2);
    });

    it('should sets first and last option values depends on max and min hours', ()=> {
      expect(this.newInstance().firstOptionValue).toEqual(0);
      expect(this.newInstance().lastOptionValue).toEqual(59);

      this.columnAttrs.max = today(1, 7);
      expect(this.newInstance().firstOptionValue).toEqual(4);
      expect(this.newInstance().lastOptionValue).toEqual(7);
    })
  });
});
