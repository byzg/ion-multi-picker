import { IMultiPickerTypeDateColumns } from '../../../../src/components/multi-picker/multi-picker-types';
import { MultiPickerTypeDate } from '../../../../src/components/multi-picker/types/date';
import { MultiPickerColumnDays } from '../../../../src/components/multi-picker/columns/days';
import { MultiPickerColumnMonths } from '../../../../src/components/multi-picker/columns/months';
import { MultiPickerColumnYears } from '../../../../src/components/multi-picker/columns/years';

describe('MultiPickerTypeDate', () => {
  beforeEach(()=> {
    this.newInstance = ()=>  new MultiPickerTypeDate({});
    this.type = this.newInstance();
  });

  describe ('constructor', ()=> {
    it('should correctly create columns objects', ()=> {
      const columns: IMultiPickerTypeDateColumns = this.type.columns();
      expect(columns.daysCol instanceof MultiPickerColumnDays).toBeTruthy();
      expect(columns.monthsCol instanceof MultiPickerColumnMonths).toBeTruthy();
      expect(columns.yearsCol instanceof MultiPickerColumnYears).toBeTruthy();
    });

    it('should call #generateOptions', () => {
      spyOn(MultiPickerTypeDate.prototype, 'generateOptions').and.callThrough();
      this.newInstance();
      expect(this.type.generateOptions).toHaveBeenCalledTimes(1);
    })
  })
});
