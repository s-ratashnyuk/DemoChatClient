export function dictToUrlHash(d: Record<string, string>, options: Record<string, any>): string {
  return Object.entries(d).reduce((akk: Array<string>, val: Array<string>) => {
    const curVal = [...akk];
    if (!('noEmpty' in options) || (options.noEmpty === true && val[1] !== '')) {
      curVal.push(val.join('='));
    }
    return curVal;
  }, []).join('&');
}
