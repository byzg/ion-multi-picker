import * as moment from 'moment';

import { MultiPicker } from '../../../../src/components/multi-picker/multi-picker';
import { MultiPickerColumnYears } from '../../../../src/components/multi-picker/columns/years';

describe('MultiPickerColumnYears', () => {
  beforeEach(()=> {
    this.newInstance = ()=>  new MultiPickerColumnYears({});
    this.column = this.newInstance();
  });

  describe ('constructor', ()=> {
    it('should correctly sets default parameters', ()=> {
      const currentYear = moment().year();
      expect(this.column.name).toEqual('years');
      expect(this.column.firstOptionValue).toEqual(currentYear - MultiPicker.YEAR_ROUND);
      expect(this.column.lastOptionValue).toEqual(currentYear + MultiPicker.YEAR_ROUND);
    })
  });
});
