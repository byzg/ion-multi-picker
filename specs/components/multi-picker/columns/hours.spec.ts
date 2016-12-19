import * as _ from 'lodash';

import { SpecHelper } from '../../../spec_helper';
import { MultiPickerColumn } from '../../../../src/components/multi-picker/multi-picker-columns';
import { MultiPickerColumnHours } from '../../../../src/components/multi-picker/columns/hours';

describe('MultiPickerColumnHours', () => {
  let h = new SpecHelper(this);
  beforeEach(()=> {
    this.columnAttrs = {
      min: h.today(2, 5),
      max: h.today(4, 3),
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
      expect(this.column.minHour).toEqual(2);
      expect(this.column.maxHour).toEqual(4);
      expect(this.column.firstOptionValue).toEqual(2);
      expect(this.column.lastOptionValue).toEqual(4);
    });
  });

  // describe('#optionText', ()=> {
  //   it('should just convert to string', ()=> {
  //     expect(this.column.optionText(7)).toEqual('7')
  //   })
  // });
});
