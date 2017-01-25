import moment from 'moment';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { By } from '@angular/platform-browser';
// import { DebugElement } from '@angular/core';
import { PickerController, Form, Item } from 'ionic-angular';
import { MultiPicker } from '../../../src/components/multi-picker/multi-picker';

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
let wrapper: TestComponentWrapper;
let fixture: ComponentFixture<TestComponentWrapper>;
// let de: DebugElement;
// let el: HTMLElement;

const pickerControllerStub = {
  create: function () {
    return pickerStub;
  }
};

// const formStub = {
//   register: function () { },
//   deregister: function () { }
// };

const itemStub = {
  registerInput: function () { },
  setElementClass: function () { }
};

const pickerStub = {
  columns: [],
  getColumns: function () {
    return this.columns;
  },
  addColumn: function (column) {
    this.columns.push(column);
  },
  present: function () { },
  onDidDismiss: function () { },
  ionChange: { subscribe: function () { } },
  instance: {
    _cols: { toArray: function () { } }
  }
};

describe('MultiPicker', () => {
  const createComponent = () => {
    fixture = TestBed.createComponent(TestComponentWrapper);
    wrapper = fixture.componentInstance;
    component = fixture.debugElement.children[0].componentInstance;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        MultiPicker,
        TestComponentWrapper
      ],
      providers: [
        { provide: PickerController, useValue: pickerControllerStub },
        // { provide: Form, useValue: formStub },
        { provide: Item, useValue: itemStub },
      ]
    });
    createComponent()
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
    })
  })
});
