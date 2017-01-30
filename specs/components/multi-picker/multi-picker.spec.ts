import _ from 'lodash';
import moment from 'moment';
import {Component, DebugElement} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PickerController, Picker, Item, Form } from 'ionic-angular';

import { MultiPicker } from '../../../src/components/multi-picker/multi-picker';
import { MultiPickerTypeDate } from '../../../src/components/multi-picker/types/date';
import { MultiPickerTypeTime } from '../../../src/components/multi-picker/types/time';

@Component({
  selector: 'test-component-wrapper',
  template: `
    <ion-multi-picker item-content [filterDays]="filterDays" [dateContext]="dateContext">
    </ion-multi-picker>`
})
class TestComponentWrapper {
  public filterDays;
  public dateContext;
}

let component: MultiPicker;
let componentElement: DebugElement;
let wrapper: TestComponentWrapper;
let fixture: ComponentFixture<TestComponentWrapper>;
let multiPickerTypeColumns: Array<{name, options}>;
let multiPickerTypeStub: MultiPickerTypeDate;

const pickerControllerStub = {
  create: function () {
    return pickerStub;
  }
};

let itemStub = {
  registerInput: function () { },
  setElementClass: function () { }
};

const pickerStub = {
  addColumn: (column: Object)=> {},
  getColumns: ()=> {},
  refresh: ()=> {},
  data: {
    buttons: ['Button1', 'Button2']
  }
};

describe('MultiPicker', () => {
  const createComponent = () => {
    fixture = TestBed.createComponent(TestComponentWrapper);
    wrapper = fixture.componentInstance;
    componentElement = fixture.debugElement.children[0];
    component = componentElement.componentInstance;
  };

  const configureModule = () => {
    TestBed.configureTestingModule({
      declarations: [
        MultiPicker,
        TestComponentWrapper
      ],
      providers: [
        { provide: PickerController, useValue: pickerControllerStub },
        { provide: Item, useValue: itemStub },
      ]
    });
  };

  const makeMultiPickerTypeStub = () => {
    multiPickerTypeColumns = [
      { name: 'fakeName1', options: [{fakeKey1: 'fakeValue1'}] },
      { name: 'fakeName2', options: [{fakeKey2: 'fakeValue2'}] }
    ];
    const map = {
      columns: multiPickerTypeColumns
    };
    multiPickerTypeStub = new MultiPickerTypeDate({});
    for(var methodName in multiPickerTypeStub) {
      if(typeof multiPickerTypeStub[methodName] == 'function') {
        let spyAnd = spyOn(multiPickerTypeStub, methodName).and;
        map[methodName] ? spyAnd.returnValue(map[methodName]) : spyAnd.stub()
      }
    }
  };

  beforeEach(() => {
    configureModule();
    createComponent();
    makeMultiPickerTypeStub();
  });

  describe('@Input', () => {
    describe('default values', () => {
      it('cancelText', () => expect(component.cancelText).toEqual('Cancel') );

      it('doneText', () => expect(component.doneText).toEqual('Done') );

      it('filterDays', () => {
        expect(component.customFilterDays).toEqual(undefined);
        wrapper.filterDays = ()=> {};
        fixture.detectChanges();
        expect(component.customFilterDays).toBe(wrapper.filterDays);
      });

      it('dateContext', () => {
        expect(component.dateContextAttr).toEqual(undefined);
        wrapper.dateContext = moment();
        fixture.detectChanges();
        expect(component.dateContextAttr).toBe(wrapper.dateContext);
      });

      it('type', () => expect(component.type).toEqual('time') );

      it('min', () => {
        expect(component.min).toEqual(moment().subtract(MultiPicker.YEAR_ROUND, 'year').startOf('year'))
      });

      it('max', () => moment().add(MultiPicker.YEAR_ROUND, 'year').endOf('year') );

      it('minuteRounding', () => expect(component.minuteRounding).toEqual(1) );

      describe('disabled', () => {
        it('get', () => {
          const expectedDisabled = { fakeKey: 'fakeVal' };
          component._disabled = expectedDisabled;
          expect(component.disabled).toBe(expectedDisabled)
        });

        it('set', () => {
          spyOn(component['_item'], 'setElementClass');
          component._disabled = false;
          component.disabled = true;
          expect(component._disabled).toBeTruthy();
          expect(component['_item'].setElementClass)
            .toHaveBeenCalledWith('item-multi-picker-disabled', component._disabled)
        })
      })
    });
  });

  describe('constructor', ()=> {
    it('should call register for the form', ()=> {
      spyOn(Form.prototype, 'register').and.callThrough();
      createComponent();
      expect(component['_form'].register).toHaveBeenCalledTimes(1);
      expect(component['_form'].register).toHaveBeenCalledWith(component);
    });

    it('should call setElementClass for the item if item is done', () => {
      spyOn(itemStub, 'setElementClass').and.callThrough();
      TestBed.resetTestingModule();
      configureModule();
      createComponent();
      expect(component['_item'].setElementClass).toHaveBeenCalledTimes(1);
      expect(component['_item'].setElementClass)
        .toHaveBeenCalledWith('item-multi-picker', true)
    });

    it('should set some attributes by default if item is done', () => {
      spyOn(itemStub, 'registerInput').and.returnValue('fakeRegisterItemResult');
      itemStub['id'] = 'fakeItemId';
      TestBed.resetTestingModule();
      configureModule();
      createComponent();
      expect(component['_item'].registerInput).toHaveBeenCalledTimes(1);
      expect(component['_item'].registerInput).toHaveBeenCalledWith('multi-picker');
      expect(component.id).toEqual('dt-fakeRegisterItemResult');
      expect(component._labelId).toEqual('lbl-fakeItemId');
      expect(component._value).toEqual('');
    });

    it('should not set some attributes by default if item is done', () => {
      itemStub = null;
      TestBed.resetTestingModule();
      configureModule();
      createComponent();
      expect(component.id).toBeFalsy();
      expect(component._labelId).toBeFalsy();
      expect(component._value).toBe(undefined);
    })
  });

  describe('#ngOnInit', () => {
    it('should set displayFormat attribute to "DD.MM.YYYY"', () => {
      component.type = 'date';
      fixture.detectChanges();
      expect(component.displayFormat).toEqual('DD.MM.YYYY')
    });

    it('should set displayFormat attribute to "HH:mm"', () => {
      fixture.detectChanges();
      expect(component.displayFormat).toEqual('HH:mm')
    });

    it('should not set displayFormat attribute if it is already given', () => {
      spyOn(component, 'ngOnInit').and.callThrough();
      component.displayFormat = 'fake display format';
      fixture.detectChanges();
      expect(component.ngOnInit).toHaveBeenCalledTimes(1);
      expect(component.displayFormat).toEqual('fake display format');
    });
  });

  describe('#ngAfterContentInit', () => {
    it('should call #setDateContext and #convertLimits', () => {
      spyOn(component, 'setDateContext').and.callThrough();
      spyOn(component, 'convertLimits').and.callThrough();
      fixture.detectChanges();
      expect(component.setDateContext).toHaveBeenCalledTimes(1);
      expect(component.convertLimits).toHaveBeenCalledTimes(1);
    })
  });

  describe('#_click', () => {
    let event;
    beforeEach(() => {
      event = {
        preventDefault: ()=>{},
        stopPropagation: ()=>{}
      };
      spyOn(component, '_click').and.callThrough();
      spyOn(component, 'open').and.stub();
      spyOn(event, 'preventDefault').and.callThrough();
      spyOn(event, 'stopPropagation').and.callThrough();
    });

    afterEach(()=> {
      expect(component._click).toHaveBeenCalledTimes(1);
    });

    it('should call #open', () => {
      componentElement.triggerEventHandler('click', event);
      expect(component.open).toHaveBeenCalledTimes(1);
      expect(event.preventDefault).toHaveBeenCalledTimes(1);
      expect(event.stopPropagation).toHaveBeenCalledTimes(1);
    });

    it('should not call #open', () => {
      event.detail = 0;
      componentElement.triggerEventHandler('click', event);
      expect(component.open).toHaveBeenCalledTimes(0);
      expect(event.preventDefault).toHaveBeenCalledTimes(0);
      expect(event.stopPropagation).toHaveBeenCalledTimes(0);
    });
  });

  describe('#_keyup', () => {
    beforeEach(() => {
      spyOn(component, '_keyup').and.callThrough();
      spyOn(component, 'open').and.stub();
    });

    afterEach(()=> {
      expect(component._keyup).toHaveBeenCalledTimes(1);
    });

    it('should call #open', () => {
      component._isOpen = false;
      componentElement.triggerEventHandler('keyup.space', null);
      expect(component.open).toHaveBeenCalledTimes(1);
    });

    it('should not call #open', () => {
      component._isOpen = true;
      componentElement.triggerEventHandler('keyup.space', null);
      expect(component.open).toHaveBeenCalledTimes(0);
    });
  });

  describe('#generate', () => {
    const spyDivyColumnsAndAddColumn = () => {
      component['multiPickerType'] = null;
      spyOn(_, 'each').and.stub();
      spyOn(component, 'divyColumns').and.stub();
    };

    it('should set multiPickerType attribute to MultiPickerTypeDate instance if type is date', () => {
      spyDivyColumnsAndAddColumn();
      component.type = 'date';
      component.generate(<Picker>pickerStub);
      expect(component['multiPickerType'] instanceof MultiPickerTypeDate).toBeTruthy();
    });

    it('should set multiPickerType attribute to MultiPickerTypeTime instance if type is not date', () => {
      spyDivyColumnsAndAddColumn();
      spyOn(MultiPickerTypeTime.prototype, 'parseFormat').and.stub();
      component.type = 'faketype';
      component.generate(<Picker>pickerStub);
      expect(component['multiPickerType'] instanceof MultiPickerTypeTime).toBeTruthy();
    });

    it('should call addColumn method for argument picker', () => {
      component.type = 'date';
      spyOn(MultiPickerTypeDate.prototype, 'columns').and.returnValue(multiPickerTypeColumns);
      spyOn(pickerStub, 'addColumn').and.stub();
      spyOn(component, 'divyColumns').and.stub();
      component.generate(<Picker>pickerStub);
      expect(component['multiPickerType'].columns).toHaveBeenCalledTimes(1);
      expect(pickerStub.addColumn).toHaveBeenCalledTimes(2);
      const addColumnArg = pickerStub.addColumn['calls'].argsFor(0)[0];
      expect(addColumnArg.name).toEqual(multiPickerTypeColumns[0].name);
      expect(addColumnArg.options).toBe(multiPickerTypeColumns[0].options);
      expect(addColumnArg.selectedIndex).toEqual(-1);
    });

    it('should call #divyColumns', () => {
      component.type = 'date';
      spyOn(component, 'divyColumns').and.stub();
      spyOn(MultiPickerTypeDate.prototype, 'columns').and.returnValue([]);
      component.generate(<Picker>pickerStub);
      expect(component.divyColumns).toHaveBeenCalledWith(pickerStub);
    });
  });

  describe('#validateColumns', () => {
    const getColumnsResult = { fakeKey: 'fakeValue' };
    beforeEach(() => {
      spyOn(pickerStub, 'getColumns').and.returnValue(getColumnsResult);
    });

    it('should call getColumns, refresh methods for argument picker and dealDoneVisibleBnt for multiPickerType', () => {
      component['multiPickerType'] = multiPickerTypeStub;
      spyOn(pickerStub, 'refresh').and.stub();
      component.validateColumns(<Picker>pickerStub);
      expect(component['multiPickerType'].dealDoneVisibleBnt).toHaveBeenCalledTimes(1);
      expect(component['multiPickerType'].dealDoneVisibleBnt).toHaveBeenCalledWith(getColumnsResult, 'Button2');
      expect(pickerStub.getColumns).toHaveBeenCalledTimes(2);
      expect(pickerStub.refresh).toHaveBeenCalledTimes(1);
    });

    it('should call MultiPicker.throw', () => {
      multiPickerTypeColumns[1].options = [];
      component['multiPickerType'] = multiPickerTypeStub;
      spyOn(MultiPicker, 'throw').and.stub();
      component.validateColumns(<Picker>pickerStub);
      expect(MultiPicker.throw).toHaveBeenCalledTimes(1);
      expect(MultiPicker.throw).toHaveBeenCalledWith('column "fakeName2" should have at least one option');
    });

    it('should work when opened', ()=> {
      component['multiPickerType'] = multiPickerTypeStub;
      component._isOpen = true;
      component.validateColumns(<Picker>pickerStub);
      expect(component['multiPickerType'].validate).toHaveBeenCalledWith(getColumnsResult)
    });

    it('should work when not opened', ()=> {
      component['multiPickerType'] = multiPickerTypeStub;
      component._isOpen = false;
      component._value = 'value';
      component.validateColumns(<Picker>pickerStub);
      expect(component['multiPickerType'].validate).toHaveBeenCalledWith(getColumnsResult, component._value);
      expect(component['multiPickerType'].setDefaultSelectedIndexes).toHaveBeenCalledWith(getColumnsResult, component._value);
      expect(pickerStub.getColumns).toHaveBeenCalledTimes(2);
    });
  });

  describe('#setDateContext', () => {
    beforeEach(() => {
      expect(component['dateContext']).toBe(undefined);
    });

    it('should just set date context attribute to empty object', () => {
      component.type = 'faketype';
      component.setDateContext();
      expect(component['dateContext']).toEqual({})
    });

    it('should correctly set dateContext attribute when _value is given', () => {
      component.type = 'time';
      component._value = '2017-01-24T14:38:42';
      component.dateContextAttr = '2015-04-19T11:14:35';
      component.setDateContext();
      expect(component['dateContext']).toEqual({ year: 2017, month: 0, day: 24 })
    });

    it('should correctly set dateContext attribute when _value is not given and dateContextAttr is given', () => {
      component.type = 'time';
      component._value = undefined;
      component.dateContextAttr = '2015-04-19T11:14:35';
      component.setDateContext();
      expect(component['dateContext']).toEqual({ year: 2015, month: 3, day: 19 })
    });

    it('should correctly set dateContext attribute when _value and dateContextAttr is not given', () => {
      component.type = 'time';
      component._value = undefined;
      component.dateContextAttr = undefined;
      component.setDateContext();
      const today = moment();
      expect(component['dateContext']).toEqual({ year: today.year(), month: today.month(), day: today.date() })
    });
  });
});
