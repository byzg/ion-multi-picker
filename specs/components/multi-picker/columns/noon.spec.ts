import * as moment from 'moment';

import { MultiPickerColumnNoon } from '../../../../src/components/multi-picker/columns/noon';

describe('MultiPickerColumnNoon', () => {
  beforeEach(()=> {
    this.columnAttrs = {
      min: moment().set({hour: 5, minute: 2}),
      max: moment().set({hour: 6, minute: 40})
    };
    this.newInstance = ()=>  new MultiPickerColumnNoon(this.columnAttrs);
    this.column = this.newInstance();
  });

  describe ('constructor', ()=> {
    it('should set default name as noon', ()=> {
      expect(this.column.name).toEqual('noon');
    });

    it('should set default firstOptionValue as 0 or 1', ()=> {
      expect(this.newInstance().firstOptionValue).toEqual(0);
      this.columnAttrs.min.add(7, 'hours');
      expect(this.newInstance().firstOptionValue).toEqual(1);
    });

    it('should set default lastOptionValue as 0 or 1', ()=> {
      expect(this.newInstance().lastOptionValue).toEqual(0);
      this.columnAttrs.max.add(7, 'hours');
      expect(this.newInstance().lastOptionValue).toEqual(1);
    });
  });

  describe ('#optionText', ()=> {
    it('should get text from format.noons', ()=> {
      expect(this.column.optionText(0)).toEqual('am');
      expect(this.column.optionText(1)).toEqual('pm');
    })
  })
});
