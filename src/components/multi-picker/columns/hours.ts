import _ from 'lodash';
import moment from 'moment';

import { MultiPickerColumn, IMultiPickerColumn, IColumnAttrs } from '../multi-picker-columns';

export class MultiPickerColumnHours extends MultiPickerColumn implements IMultiPickerColumn {
  minHour = this.min.hour();
  maxHour = this.max.hour();
  existingHours: Object = {};
  isDoubleNoon: boolean = this.minHour < 11 && 11 < this.maxHour;

  name = 'hour';
  firstOptionValue = this.minHour;
  lastOptionValue =  this.maxHour;

  constructor(attrs: IColumnAttrs) {
    super(attrs);
    this.initWith12hours()
  }

  filter(noon: number): Array<number> {
    return this.filterLimits(noon).values
  }

  filterLimits(noon: number): MultiPickerColumnHours {
    if (!this.existingHours[noon]) {
      this.generateOptions();
      let existingHours = this.values;
      if (this.isDoubleNoon)
        existingHours = noon == 0 ? [this.minHour % 12, 11] : [0, this.maxHour % 12];
      else
        existingHours = [this.minHour % 12, this.maxHour % 12];
      existingHours = _.filter(this.values, (hour)=> existingHours[0] <= hour && hour <= existingHours[1] );
      this.existingHours[noon] = super.toOptions(existingHours, {noon: noon});
    }
    this.options = this.existingHours[noon];
    return this
  }

  protected optionText(num: number): string {
    return _.padStart(`${this.zeroOrTwelve(num)}`, 2, '0')
  }

  protected optionValue(num: number, attrs: Object = {}): number {
    return num + attrs['noon'] * 12
  }

  protected selectedValue(datetime: string, momentName: string): number {
    let selectedValue = moment(datetime).hour() % this.format.hours;
    return this.zeroOrTwelve(selectedValue)
  }

  private zeroOrTwelve(num: number): number {
    return this.format.is12 && num == 0 ? 12 : num
  }

  private initWith12hours(): void {
    if (this.format.is12) {
      if (this.isDoubleNoon) {
        this.firstOptionValue = 0;
        this.lastOptionValue = 11;
      } else if (11 < this.maxHour) {
        this.firstOptionValue = this.minHour % 12;
        this.lastOptionValue = this.maxHour % 12;
      }
    }
  }
}
