import * as moment from 'moment';
import * as _ from 'lodash';
import { PickerColumn } from 'ionic-angular';

import { MultiPickerType, IMomentObject } from '../../../src/components/multi-picker/multi-picker-types';

export interface IMomentFakeObject extends IMomentObject {
  fakeMinutes?: number,
  fakeHours?: number
}
let defaultMomentResult = {
  fakeMinutes: 36,
  fakeHours: 7
};
class StubMultiPickerType extends MultiPickerType {
  setColumns(val) {
    this._columns = val
  }

  protected defaultMoment(pickerValue: string): IMomentFakeObject {
    return defaultMomentResult
  }
}

let stubType: StubMultiPickerType;
let columns: Array<PickerColumn>;
describe('MultiPickerType', () => {
  beforeEach(()=> {
    stubType = new StubMultiPickerType()
    columns = [
      {
        name: 'fakeMinutes',
        options: [{ text: '34', value: 34 }, { text: '35', value: 35 }, { text: '36', value: 36 }],
        selectedIndex: 1
      },
      {
        name: 'fakeHours',
        options: [{ text: '05', value: 5 }, { text: '06', value: 6 }, { text: '07', value: 7 }],
        selectedIndex: 0
      }
    ]
  });

  describe('#columns', () => {
    it('should return _columns', () => {
      stubType.setColumns(columns);
      expect(stubType.columns()).toBe(columns)
    })
  });

  describe('#dealDoneVisibleBnt', () => {
    beforeEach(()=> {
      this.button = {}
    });
    it('should set empty string', () => {
      stubType.dealDoneVisibleBnt(columns, this.button);
      expect(this.button.cssRole).toEqual('')
    });

    it('should set hide if selected option of at least one column is disabled', () => {
      columns[0].options[columns[0].selectedIndex].disabled = true;
      stubType.dealDoneVisibleBnt(columns, this.button);
      expect(this.button.cssRole).toEqual('hide')
    })
  });

  describe('#setDefaultSelectedIndexes', () => {
    it('should set indexes from defaultMoment when it is given', () => {
      spyOn(stubType, 'defaultMoment').and.callThrough();
      stubType.setDefaultSelectedIndexes(columns, '17');
      expect(columns[0].selectedIndex).toEqual(2);
      expect(columns[1].selectedIndex).toEqual(2);
      expect(stubType['defaultMoment']).toHaveBeenCalledWith('17')
    });

    it('should set zeros when defaultMoment is NOT given', () => {
      spyOn(stubType, 'defaultMoment').and.returnValue({});
      stubType.setDefaultSelectedIndexes(columns, '17');
      expect(columns[0].selectedIndex).toEqual(0);
      expect(columns[1].selectedIndex).toEqual(0);
      expect(stubType['defaultMoment']).toHaveBeenCalledWith('17')
    })
  });

  describe('#currentMoment', () => {
    it('should return defaultMoment when pickerValue is string', () => {
      spyOn(stubType, 'defaultMoment').and.callThrough();
      expect(stubType['currentMoment'](columns, '17')).toBe(defaultMomentResult);
      expect(stubType['defaultMoment']).toHaveBeenCalledWith('17')
    });

    it('should return defaultMoment when pickerValue is moment', () => {
      const _moment = moment();
      spyOn(stubType, 'defaultMoment').and.callThrough();
      expect(stubType['currentMoment'](columns, _moment)).toBe(defaultMomentResult);
      expect(stubType['defaultMoment']).toHaveBeenCalledWith(_moment)
    });

    it('should be calculated from selected indexes', () => {
      spyOn(stubType, 'defaultMoment').and.callThrough();
      expect(stubType['currentMoment'](columns, null)).toEqual({fakeMinutes: 35, fakeHours: 5});
      expect(stubType['defaultMoment']).toHaveBeenCalledTimes(0)
    })
  });

  describe('#generateOptions', () => {
    it('should call generateOptions for each column', () => {
      _.each(columns, column => {
        column['generateOptions'] = ()=>{};
        spyOn(column, 'generateOptions').and.callThrough();
      });
      stubType.setColumns(columns);
      stubType['generateOptions']();
      _.each(columns, column => {
        expect(column['generateOptions']).toHaveBeenCalledTimes(1)
      })
    })
  });

  describe('#disableInvalid', () => {
    it('should compare filtered options and all options', () => {
      let column = columns[0];
      column['filter'] = ()=> {};
      spyOn(column, 'filter').and.returnValue(_.map([column.options[0], column.options[2]], 'value'));
      stubType.setColumns({fakeMinutes: column});
      stubType['disableInvalid'](columns, 'fakeMinutes', 0, [1]);
      expect(column.options[1].disabled).toBe(true);
      expect(column['filter']).toHaveBeenCalledTimes(1)
    })
  })
});
