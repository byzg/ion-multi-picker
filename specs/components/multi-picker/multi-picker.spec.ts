import moment from 'moment';
import {Component, DebugElement} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PickerController, Picker, Item, Form } from 'ionic-angular';

import { MultiPicker } from '../../../src/components/multi-picker/multi-picker';
import { MultiPickerTypeDate } from '../../../src/components/multi-picker/types/date';

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
// let de: DebugElement;
// let el: HTMLElement;

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

  beforeEach(() => {
    configureModule();
    createComponent();
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
    it('should set multiPickerType attribute to MultiPickerTypeDate instance if type is date', () => {
      spyOn(MultiPickerTypeDate).and.stub();
      component.generate(<Picker>pickerStub)
    });
  });
});
