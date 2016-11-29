import { MultiPickerColumn, IMultiPickerColumn } from '../multi-picker-columns';

export class MultiPickerColumnMonths extends MultiPickerColumn implements IMultiPickerColumn {
  name = 'month';
  lastOptionValue = 12;

  selectedOptionIndex(datetime: string, momentName: string = this.name): number {
    return super.selectedOptionIndex(datetime, momentName) + 1
  }
}
