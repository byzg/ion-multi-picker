import { MultiPickerColumnMonths } from '../../../../src/components/multi-picker/columns/months';

describe('MultiPickerColumnMonths', () => {
  beforeEach(()=> {
    this.newInstance = ()=>  new MultiPickerColumnMonths();
    this.column = this.newInstance();
  });

  describe ('constructor', ()=> {
    it('should correctly sets default parameters', ()=> {
      expect(this.column.name).toEqual('months');
      expect(this.column.lastOptionValue).toEqual(12);
    })
  });
});
