export function urlhashToDict(data: string): Record<string, string> {
  const res = data.substring(1).split('&').reduce((akk: Record<string, string>, el:string) => {
    const tmp = el.split('=');
    akk[tmp[0]] = tmp[1]; // eslint-disable-line
    return akk;
  }, {} as Record<string, string>);
  return res;
}
