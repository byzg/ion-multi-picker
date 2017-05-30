import *  as _ from 'lodash';
import * as moment from 'moment';

export interface IMultiPickerOption {
  text?: string
  value?: any;
  parentVal?: any | Array<any>;
  disabled?:boolean;
}

export interface IColumnFormat {
  is12: boolean,
  noons: Array<string>,
  hours: number
  displayFormat: string,
  pickerFormat: string
}

export interface IColumnAttrs {
  name?: string,
  firstOptionValue?: number,
  lastOptionValue?: number,
  step?: number,
  format?: IColumnFormat,
  min?: moment.Moment,
  max?: moment.Moment
}

export interface IMultiPickerColumn extends IColumnAttrs {
  options: IMultiPickerOption[]
}

export class MultiPickerColumn implements IMultiPickerColumn {
  static get defaultFormat(): IColumnFormat {
    return {
      is12: false,
      noons: ['am', 'pm'],
      hours: 24,
      displayFormat: 'DD.MM.YYYY HH:MM',
      pickerFormat: 'DD.MM.YYYY HH:MM'
    }
  };
  name: string;
  firstOptionValue: number = 1;
  lastOptionValue: number;
  step: number = 1;
  format: IColumnFormat = MultiPickerColumn.defaultFormat;
  options: Array<IMultiPickerOption>;
  min: moment.Moment;
  max: moment.Moment;

  constructor(attrs: IColumnAttrs) {
    _.merge(this, attrs);
  }

  get values(): number[] {
    return _.map(this.options, option => parseInt(option.value))
  }

  protected generateOptions(): void {
    this.options = this.range(this.firstOptionValue, this.lastOptionValue);
  }

  protected range(from:number, to:number): Array<IMultiPickerOption> {
    return this.toOptions(_.range(from, to + 1, this.step))
  }

  protected optionText(num: number): string {
    return `${num}`
  }

  protected toOption(num: number): IMultiPickerOption  {
    return _.extend({ text: this.optionText(num), value: num })
  };

  protected toOptions(nums: Array<number>): Array<IMultiPickerOption>  {
    return nums.map(val => { return this.toOption(val) })
  };
}
