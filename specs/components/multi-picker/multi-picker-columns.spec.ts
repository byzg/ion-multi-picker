import * as moment from 'moment';

import { MultiPickerColumn } from '../../../src/components/multi-picker/multi-picker-columns';

describe('MultiPickerColumn', () => {
  beforeEach(()=> {
    this.columnAttrs = {
      name: 'years',
      firstOptionValue: 5,
      lastOptionValue: 7,
      step: 1,
      format: MultiPickerColumn.defaultFormat,
      min: moment(),
      max: moment().add(2, 'year')
    };
    this.options = [
      { text: '5', value: 5 }, { text: '6', value: 6 }, { text: '7', value: 7 }
    ];
    this.newInstance = ()=>  new MultiPickerColumn(this.columnAttrs);
    this.column = this.newInstance();
    this.instance =  this.column;
  });

  it('.defaultFormat', () => {
    expect(MultiPickerColumn.defaultFormat).toEqual({
      is12: false,
      noons: ['am', 'pm'],
      hours: 24,
      displayFormat: 'DD.MM.YYYY HH:mm',
      pickerFormat: 'DD.MM.YYYY HH:mm'
    })
  });

  it('default attrs', () => {
    let column = new MultiPickerColumn({});
    expect(column.firstOptionValue).toEqual(1);
    expect(column.step).toEqual(1);
    expect(column.format).toEqual(MultiPickerColumn.defaultFormat);
  });

  describe ('constructor', ()=> {
    it('should merge any IColumnAttrs object with itself', ()=> {
      for (let [key, value] of this.columnAttrs) {
        expect(this.column[key]).toEqual(value)
      }
    })
  });

  describe('#values', ()=> {
    it('should pluck value from options', ()=> {
      this.column.options = [{value: 5}, {value: '7'}];
      expect(this.column.values).toEqual([5, 7])
    })
  });

  describe('#optionText', ()=> {
    it('should just convert to string', ()=> {
      expect(this.column.optionText(7)).toEqual('7')
    })
  });

  describe('#toOption', ()=> {
    it('should get a number and return option object', ()=> {
      spyOn(this.column, 'optionText').and.callThrough();
      expect(this.column.toOption(7)).toEqual({text: '7', value: 7});
      expect(this.column['optionText']).toHaveBeenCalledWith(7)
    })
  });

  describe('#toOptions', ()=> {
    it('should get a array of numbers and return options array', ()=> {
      spyOn(this.column, 'toOption').and.callThrough();
      expect(this.column.toOptions([5, 7])).toEqual([ { text: '5', value: 5 }, { text: '7', value: 7 } ]);
      expect(this.column['toOption']).toHaveBeenCalledWith(5);
      expect(this.column['toOption']).toHaveBeenCalledWith(7)
    })
  });

  describe('#range', ()=> {
    it('should get a values of the first and the last option and returns array o options', ()=> {
      spyOn(this.column, 'toOptions').and.callThrough();
      expect(this.column.range(5, 7)).toEqual(this.options);
      expect(this.column['toOptions']).toHaveBeenCalledWith([5, 6, 7]);
    })
  });

  describe('#generateOptions', ()=> {
    it('should set options based on #range', ()=> {
      spyOn(this.column, 'range').and.callThrough();
      expect(this.column.options).toEqual(undefined);
      this.column.generateOptions();
      expect(this.column.options).toEqual(this.options);
      expect(this.column['range']).toHaveBeenCalledWith(this.column.firstOptionValue, this.column.lastOptionValue);
    })
  });
});

