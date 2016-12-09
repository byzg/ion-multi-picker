import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { PickerController, Form, Item } from 'ionic-angular';
import { MultiPicker } from '../../../src/components/multi-picker/multi-picker';

let comp: MultiPicker;
let fixture: ComponentFixture<MultiPicker>;
let de: DebugElement;
let el: HTMLElement;

const pickerControllerStub = {
  create: function () {
    return pickerStub;
  }
};

const formStub = {
  register: function () { },
  deregister: function () { }
};

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
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MultiPicker],
      providers: [
        {provide: PickerController, useValue: pickerControllerStub},
        {provide: Form, useValue: formStub},
        {provide: Item, useValue: itemStub},
      ],

    });

    fixture = TestBed.createComponent(MultiPicker);

    comp = fixture.componentInstance;
  });

  it('should not open picker when disabled', () => {
    comp.disabled = true;
    expect(comp.open()).toBeUndefined();
  });
});
