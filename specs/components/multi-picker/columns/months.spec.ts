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

  describe ('#optionText', ()=> {
    it('should return formatted month name', ()=> {
      this.column.pickerFormat = 'MM';
      expect(this.column.optionText(1)).toEqual('01');
      this.column.pickerFormat = 'MMM';
      expect(this.column.optionText(1)).toEqual('Jan');
      this.column.pickerFormat = 'MMMM';
      expect(this.column.optionText(1)).toEqual('January');
    })
  });

  describe ('#parseFormat', ()=> {
    it('should change pickerFormat selecting first "M" letters sequence', ()=> {
      this.column.pickerFormat = 'Sergey Mavrody was leader of MMM-company';
      this.column.parseFormat();
      expect(this.column.pickerFormat).toEqual('M');
    })
  });
});
