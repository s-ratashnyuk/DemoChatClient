export function setAuth() {
  document.cookie = 'isLoggedIn=1';
}

export function removeAuth() {
  document.cookie = 'isLoggedIn=1; max-age=-1';
}

export function isLoggedIn() {
  const cooks = document.cookie.split(';');
  const cooksDict = cooks.reduce((akk: Record<string, string>, val: string) => {
    const tmp = val.split('=');
    if (tmp.length > 1) {
      akk[tmp[0].trim()] = tmp[1].trim(); // eslint-disable-line
    }
    return akk;
  }, {} as Record<string, string>);

  if ('isLoggedIn' in cooksDict) {
    return cooksDict.isLoggedIn === '1';
  }
  return false;
}
