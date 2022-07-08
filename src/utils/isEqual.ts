type PlainObject<T = unknown> = {
  [key in string]: T;
};

export function isPlainObject(a: unknown): a is PlainObject {
  return typeof a === 'object'
      && a !== null
      && a.constructor === Object
      && Object.prototype.toString.call(a) === '[object Object]';
}

export function isArrayObject(a: unknown): a is [] {
  return Array.isArray(a);
}

export function isArrayOrObject(a: unknown): a is ([] | PlainObject) {
  return isPlainObject(a) || isArrayObject(a);
}

function isEqualArrayOrObject(a: PlainObject, b: PlainObject): boolean {
  for (const [key, leftValue] of Object.entries(a)) {
    const rightValue = b[key];
    if (isArrayOrObject(leftValue) && isArrayOrObject(rightValue)) {
      if (!isEqualArrayOrObject(leftValue as PlainObject, rightValue as PlainObject)) {
        return false;
      }
    }
    if (leftValue !== rightValue) {
      return false;
    }
  }
  return true;
}

export function isEqual(a: any, b: any) {
  if (isArrayOrObject(a) && isArrayOrObject(b)) {
    return isEqualArrayOrObject(a as PlainObject, b as PlainObject);
  }
  return a === b;
}
