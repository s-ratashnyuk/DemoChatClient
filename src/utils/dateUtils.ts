export function dateCompare(a: Date, b: Date, compOperator: string): boolean {
  const aStr = `${a.getDate()}-${a.getMonth()}-${a.getFullYear()}`;
  const bStr = `${b.getDate()}-${b.getMonth()}-${b.getFullYear()}`;
  switch (compOperator) {
    case 'eq':
      return aStr === bStr;
    case 'gt':
      return a > b;
    case 'lt':
      return a < b;
    default:
      throw Error('Have to specify comparsion operator');
  }
}

function add0(a: number) {
  return a >= 10 ? `${a}` : `0${a}`;
}

export function timeToStr(a: Date): string {
  const h = add0(a.getHours());
  const m = add0(a.getMinutes());
  return `${h}:${m}`;
}

export function dateToStr(a: Date, dateType = 'dateLong'): string {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  if (dateType === 'dateLong') {
    return `${a.getDate()} ${months[a.getMonth()]} ${a.getFullYear()}`;
  }
  return `${a.getDate()}.${add0(a.getMonth())}.${a.getFullYear()}`;
}

export function timeOrDate(a: Date, dateType = 'dateLong'): string {
  const b = new Date();
  if (dateCompare(a, b, 'eq')) {
    return timeToStr(a);
  }
  return dateToStr(a, dateType);
}
