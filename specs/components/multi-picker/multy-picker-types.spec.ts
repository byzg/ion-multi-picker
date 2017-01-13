import { MultiPickerType, IMomentObject } from '../../../src/components/multi-picker/multi-picker-types';

class StubMultiPickerType extends MultiPickerType {
  setColumns(val) {
    this._columns = val
  }

  protected defaultMoment(pickerValue: string): IMomentObject {
    return {}
  }
}

describe('MultiPicker', () => {
  beforeEach(()=> {
    this.stubType = new StubMultiPickerType()
  })

  describe('#columns', () => {
    it('should return _columns', () => {
      const columns = {fakeKey: 'fakeVal'}
      this.stubType.setColumns(columns)
      expect(this.stubType.columns()).toBe(columns)
    })
  })
})
