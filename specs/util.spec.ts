import { MultiPickerUtils } from '../src/util';

describe('MultiPickerUtils', () => {
  describe('.minuteRound', () => {
    let time = (minute: string, second: string = '00')=> `2016-12-10T11:${minute}:${second}+03:00`;

    it('should round to 6x when given 6x+2', () => {
      expect(MultiPickerUtils.minuteRound(time('38', '44'), 6).format()).toEqual(time('36'))
    });

    it('should round to 6x when given 6x+5', () => {
      expect(MultiPickerUtils.minuteRound(time('41', '44'), 6).format()).toEqual(time('36'))
    });

    it('should return same as moment when rounding is 1', () => {
      expect(MultiPickerUtils.minuteRound(time('41'), 1).format()).toEqual(time('41'))
    })
  })
});
