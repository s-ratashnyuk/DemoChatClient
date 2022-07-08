const doCheck = (str: string, strRegexp: string): boolean => {
  const re = new RegExp(strRegexp);
  return re.test(str);
};

export const validateName = (str: string): boolean => {
  return doCheck(str, '[A-ZА-Я][a-zа-я-]+');
};

export const validateLogin = (str: string): boolean => {
  return doCheck(str, '^[a-zA-Z0-9_-]{3,20}$')
      && doCheck(str, '^[a-zA-Z]+');
};

export const validateEmail = (str: string): boolean => {
  return doCheck(str, '[a-zA-Z0-9-]+@[a-zA-Z]+\\.[a-zA-Z0-9-]+');
};

export const validatePhone = (str: string): boolean => {
  return doCheck(str, '^\\+*[0-9]{10,15}$');
};

export const validateMessage = (str: string): boolean => {
  return str.length > 0;
};

export const validatePassword = (str: string): boolean => {
  return doCheck(str, '^.{8,40}$') && doCheck(str, '\\d+') && doCheck(str, '[A-Z]+');
};

export const validateRepPassword = (lhs: string, rhs: string): boolean => {
  return lhs === rhs;
};
