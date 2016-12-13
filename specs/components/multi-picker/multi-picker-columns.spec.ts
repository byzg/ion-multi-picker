import * as moment from 'moment';
import { MultiPickerColumn } from '../../../src/components/multi-picker/multi-picker-columns';

describe('MultiPickerColumn', () => {
  beforeEach(() => {
  });

  let columnsAttrs = {
    name: 'years',
    firstOptionValue: 3,
    lastOptionValue: 7,
    step: 1,
    format: MultiPickerColumn.defaultFormat,
    min: moment(),
    max: moment().add(2, 'year')
  };

  it('.defaultFormat', () => {
    expect(MultiPickerColumn.defaultFormat).toEqual({
      pattern: '',
      is12: false,
      noons: ['am', 'pm'],
      hours: 24,
    })
  });

  it('default attrs', () => {
    let columns = new MultiPickerColumn({});
    expect(columns.firstOptionValue).toEqual(1);
    expect(columns.step).toEqual(1);
    expect(columns.format).toEqual(MultiPickerColumn.defaultFormat);
  });

  describe ('constructor', ()=> {
    it('should merge any IColumnAttrs object with itself', ()=> {
      let columns = new MultiPickerColumn(columnsAttrs);
      for (let [key, value] of columnsAttrs) {
        expect(columns[key]).toEqual(value)
      }
    })
  })
});

