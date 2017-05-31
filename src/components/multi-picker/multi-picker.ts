import { AfterContentInit, Component, EventEmitter, forwardRef, HostListener, Input, OnDestroy, Optional, Output,
         ViewEncapsulation, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { Picker, PickerController, Form, Item } from 'ionic-angular';
import _ from 'lodash';
import moment from 'moment';

import { MultiPickerTypeDate } from './types/date';
import { MultiPickerTypeTime } from './types/time';
import { MultiPickerColumn } from './multi-picker-columns';

export interface ChangingValuePart {
  columnIndex: number,
  text: string,
  value: number
}

export interface ChangingValue {
  minute?: ChangingValuePart,
  hour?: ChangingValuePart,
  day?: ChangingValuePart,
  month?: ChangingValuePart,
  year?: ChangingValuePart
}

export const MULTI_PICKER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MultiPicker),
  multi: true
};

@Component({
  selector: 'ion-multi-picker',
  template: '<div class="multi-picker-text">{{_text}}</div>' +
  '<button aria-haspopup="true" ' +
  'type="button" ' +
  '[id]="id" ' +
  'ion-button="item-cover" ' +
  '[attr.aria-labelledby]="_labelId" ' +
  '[attr.aria-disabled]="_disabled" ' +
  'class="item-cover">' +
  '</button>',
  host: {
    '[class.multi-picke-disabled]': '_disabled'
  },

  providers: [MULTI_PICKER_VALUE_ACCESSOR, Form],
  encapsulation: ViewEncapsulation.None,
})

export class MultiPicker implements AfterContentInit, ControlValueAccessor, OnDestroy, OnInit {
  static YEAR_ROUND = 2;
  _disabled: any = false;
  _labelId: string = '';
  _text: string = '';
  _fn: Function;
  _isOpen: boolean = false;
  _value: any;
  id: string;
  private multiPickerType: MultiPickerTypeDate | MultiPickerTypeTime;
  private dateContext: { year: number, month: number, day: number } | {};

  @Input() cancelText: string = 'Cancel';
  @Input() doneText: string = 'Done';
  @Input() formControl: FormControl;
  @Input('filterDays') customFilterDays: Function;
  @Input('dateContext') dateContextAttr: moment.Moment | string;
  @Input() weekends: string|string[];
  @Input() type: string = 'time';
  @Input() displayFormat: string;
  @Input() pickerFormat: string;
  @Input() min: moment.Moment = moment().subtract(MultiPicker.YEAR_ROUND, 'year').startOf('year');
  @Input() max: moment.Moment = moment().add(MultiPicker.YEAR_ROUND, 'year').endOf('year');
  @Input() minuteRounding: string|number = 1;
  @Input()
  get disabled() {
    return this._disabled;
  }
  set disabled(val: boolean) {
    this._disabled = val;
    this._item && this._item.setElementClass('item-multi-picker-disabled', this._disabled);
  }

  @Output() ionChange: EventEmitter<any> = new EventEmitter();
  @Output() ionCancel: EventEmitter<any> = new EventEmitter();

  constructor(
    private _form: Form,
    @Optional() private _item: Item,
    @Optional() private _pickerCtrl: PickerController
  ) {
    this._form.register(this);
    if (_item) {
      this.id = 'dt-' + _item.registerInput('multi-picker');
      this._labelId = 'lbl-' + _item['id'];
      this._item.setElementClass('item-multi-picker', true);
      this._value = this._value || '';
    }
  }

  ngOnInit() {
    if (!this.displayFormat)
      this.displayFormat = this.displayFormat || this.type == 'date' ? 'DD.MM.YYYY' : 'HH:mm';
    if (!this.pickerFormat)
      this.pickerFormat = this.displayFormat || MultiPickerColumn.defaultFormat.pickerFormat
  }

  ngAfterContentInit() {
    // update how the multi picker value is displayed as formatted text
    this.setDateContext();
    this.convertLimits();
  }

  @HostListener('click', ['$event'])
  _click(ev: UIEvent) {
    if (ev.detail === 0) {
      // do not continue if the click event came from a form submit
      return;
    }
    ev.preventDefault();
    ev.stopPropagation();
    this.open();
  }

  @HostListener('keyup.space')
  _keyup() {
    if (!this._isOpen) {
      this.open();
    }
  }

  /**
   * Open the picker panel
   * @private
   */
  open() {
    this.setDateContext();
    this.convertLimits();
    if (this._disabled) return;

    let pickerOptions: any = {};

    let picker = this._pickerCtrl.create(pickerOptions);
    pickerOptions.buttons = [
      {
        text: this.cancelText,
        role: 'cancel',
        handler: () => {
          this.ionCancel.emit(null);
        }
      },
      {
        text: this.doneText,
        handler: (data: any) => {
          this.onChange(data);
          this.ionChange.emit(data);
        }
      }
    ];

    this.generate(picker);
    this.validateColumns(picker);

    picker.ionChange.subscribe(() => {
      this.validateColumns(picker);
    });
    picker.present(pickerOptions);

    this._isOpen = true;
    picker.onDidDismiss(() => {
      this._isOpen = false;
    });
  }

  generate(picker: Picker) {
    const { pickerFormat } = this;
    const commonParams = { pickerFormat };
    if (this.type == 'date') {
      const { customFilterDays, weekends } = this;
      this.multiPickerType = new MultiPickerTypeDate(
        _.extend(commonParams, { customFilterDays, weekends }))
    } else {
      const { min, max, minuteRounding } = this;
      this.multiPickerType = new MultiPickerTypeTime(
        _.extend(commonParams, { min, max, minuteRounding })
      )
    }

    _.each(this.multiPickerType.columns(), (column) => {
      picker.addColumn({
        name: column.name,
        options: column.options,
        selectedIndex: -1,
      })
    });
    this.divyColumns(picker);
  }

  validateColumns(picker: Picker) {
    let columns = picker.getColumns();
    _.each(this.multiPickerType.columns(), (column)=> {
      if (!column.options.length) MultiPicker.throw(`column "${column.name}" should have at least one option`)
    });
    if (this._isOpen)
      this.multiPickerType.validate(columns);
    else {
      this.multiPickerType.validate(columns, this._value);
      this.multiPickerType.setDefaultSelectedIndexes(picker.getColumns(), this._value);
    }
    this.multiPickerType.dealDoneVisibleBnt(columns, picker['data'].buttons[1]);

    picker.refresh();
  }

  setDateContext(): void {
    this.dateContext = {};
    if (this.type == 'time') {
      const attr = moment(this.dateContextAttr) || moment();
      const dateContext = _.pick((this._value ? moment(this._value) : attr).toObject(), ['years', 'months', 'date']);
      const map = { years: 'year', months: 'month', date: 'day' };
      _.each(dateContext, (val, key) => this.dateContext[map[key]] = val)
    }
  }

  convertLimits(): void {
    ['min', 'max'].forEach(limit=> {
      let momentLimit = moment(this[limit]);
      this[limit] = moment(this.dateContext).set({hour: momentLimit.hour(), minute: momentLimit.minute()})
    });
    if (this.type == 'time' && this.max.hours() == 0)
      this.max = this.max.endOf('date')
  }

  divyColumns(picker: Picker) {
    let pickerColumns = picker.getColumns();
    let columns: number[] = [];

    pickerColumns.forEach((col, i) => {
      columns.push(0);

      col.options.forEach(opt => {
        if (opt.text.replace(/[^\x00-\xff]/g, "01").length > columns[i]) {
          columns[i] = opt.text.replace(/[^\x00-\xff]/g, "01").length;
        }
      });

    });

    if (columns.length === 2) {
      var width = Math.max(columns[0], columns[1]);
      pickerColumns[0].columnWidth = pickerColumns[1].columnWidth = `${width * 16}px`;

    } else if (columns.length === 3) {
      var width = Math.max(columns[0], columns[2]);
      pickerColumns[1].columnWidth = `${columns[1] * 16}px`;
      pickerColumns[0].columnWidth = pickerColumns[2].columnWidth = `${width * 16}px`;

    } else if (columns.length > 3) {
      columns.forEach((col, i) => {
        pickerColumns[i].columnWidth = `${col * 12}px`;
      });
    }
  }

  setValue(newData: ChangingValue) {
    if(newData=== null || newData === undefined){
      this._value = '';
    }else{
      this._value = newData;
    }
  }

  checkHasValue(inputValue: any) {
    if (this._item) {
      this._item.setElementClass('input-has-value', !!(inputValue && inputValue !== ''));
    }
  }

  updateText() {
    this._text = this._value? moment(this._value).format(this.displayFormat) : '';
  }

  convertObjectToString(newData: ChangingValue) {
    let newMomentObj: {months?: number, hour?: number, noon?: number} = {};
    _.each(newData, (timepart, name)=> newMomentObj[name] = timepart.value );
    if (newMomentObj.months) newMomentObj.months = newMomentObj.months - 1;
    _.extend(newMomentObj, this.dateContext);
    return _.isEmpty(newMomentObj) ? '' : moment(newMomentObj).format();
  }

  static throw(msg): void {
    throw `Ion2 datetime picker: ${msg}`
  }

  // hooks:
  writeValue(val: ChangingValue) {
    this.setValue(val);
    this.updateText();
    this.checkHasValue(val);
  }

  registerOnChange(fn: Function): void {
    this._fn = fn;
    this.onChange = (val: ChangingValue) => {
      this.setValue(this.convertObjectToString(val));
      this.updateText();
      this.checkHasValue(val);

      fn(this._value);
      this.onTouched();
    };
  }

  registerOnTouched(fn: any) { this.onTouched = fn; }

  ngOnDestroy() {
    this._form.deregister(this);
  }

  onChange(val: ChangingValue) {
    // onChange used when there is not an formControlName
    this.setValue(this.convertObjectToString(val));
    this.updateText();
    this.onTouched();
  }

  onTouched() { }
}
