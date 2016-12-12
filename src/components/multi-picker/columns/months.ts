import { MultiPickerColumn, IMultiPickerColumn } from '../multi-picker-columns';

export class MultiPickerColumnMonths extends MultiPickerColumn implements IMultiPickerColumn {
  name = 'months';
  lastOptionValue = 12;
}
