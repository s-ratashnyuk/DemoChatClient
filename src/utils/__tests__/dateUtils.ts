import { timeToStr, dateCompare, timeOrDate } from '../dateUtils';

describe('utils/dateUtlis', () => {
  it('time should be 10:12', () => {
    const d = new Date('2022-01-01 10:12');
    expect(timeToStr(d)).toBe('10:12');
  });

  it('time should be 00:03', () => {
    const d = new Date('2022-01-01 0:03');
    expect(timeToStr(d)).toBe('00:03');
  });

  it('dates should be equal', () => {
    const d1 = new Date('2022-01-01 00:00:00');
    const d2 = new Date('2022-01-01 23:59:59');
    expect(dateCompare(d1, d2, 'eq')).toBe(true);
  });

  it('should return time string', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2022-05-01 10:00:00'));

    const d1 = new Date('2022-05-01 23:59:59');
    expect(timeOrDate(d1)).toBe('23:59');
  });

  it('should return date string', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2022-05-01 10:00:00'));

    const d1 = new Date('2022-04-01 23:59:59');
    expect(timeOrDate(d1)).toBe('1 Apr 2022');
  });
});
