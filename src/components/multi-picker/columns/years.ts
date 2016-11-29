import moment from 'moment';

import { MultiPicker } from '../multi-picker';
import { MultiPickerColumn, IMultiPickerColumn } from '../multi-picker-columns';

let currentYear = moment().year();
export class MultiPickerColumnYears extends MultiPickerColumn implements IMultiPickerColumn {
  name = 'year';
  firstOptionValue = currentYear - MultiPicker.YEAR_ROUND;
  lastOptionValue = currentYear + MultiPicker.YEAR_ROUND;
}
