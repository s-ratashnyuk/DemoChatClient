export enum RequestMethods {
  GET = 'GET',
  POST = 'POST',
  DELETE = 'DELETE',
  PUT = 'PUT',
}
type PlainObject<T = unknown> = {
  [key in string]: T;
};

function isPlainObject(a: unknown): a is PlainObject {
  return typeof a === 'object'
      && a !== null
      && a.constructor === Object
      && Object.prototype.toString.call(a) === '[object Object]';
}

function isArrayObject(a: unknown): a is [] {
  return Array.isArray(a);
}

function isArrayOrObject(a: unknown): a is ([] | PlainObject) {
  return isPlainObject(a) || isArrayObject(a);
}

function queryStringifyInternal(obj: Record<string, any>, prevKeys = ''): Array<Array<string>> {
  const res: Array<Array<string>> = [];
  if (typeof obj !== 'object') {
    throw Error('input must be an object');
  }
  for (const [key, el] of Object.entries(obj)) {
    const nextPrevKey = prevKeys === '' ? `${prevKeys}${key}` : `${prevKeys}[${key}]`;
    if (isArrayOrObject(el)) {
      const tmp = queryStringifyInternal(el, nextPrevKey);
      for (const [, ael] of Object.entries(tmp)) {
        res.push([`${ael[0]}`, ael[1]]);
      }
    } else {
      res.push([`${nextPrevKey}`, `${el}`]);
    }
  }
  return res;
}

export function queryStringify(data: Record<string, any>): string | never {
  const res = queryStringifyInternal(data);
  return `?${res.map((e) => { return e.join('='); }).join('&')}`;
}

type RequestOptions = {
  headers?: Record<string, string>,
  data?: Record<string, any>,
  timeout?: number,
  method?: RequestMethods,
  isFormData?: boolean,
  formData?: FormData,
};

export interface RequestClass extends Function {
  get: Function,
  post: Function,
  put: Function,
  delete: Function,
}

export class Requests {
  static get(url: string, options: RequestOptions = {}) {
    const getQuery = options.data ? queryStringify(options.data) : '';
    const tmpUrl = `${url}${getQuery}`;
    return this.request(tmpUrl, { ...options, method: RequestMethods.GET });
  }

  static post(url: string, options: RequestOptions) {
    return this.request(url, { ...options, method: RequestMethods.POST });
  }

  static put(url: string, options: RequestOptions) {
    return this.request(url, { ...options, method: RequestMethods.PUT });
  }

  static delete(url: string, options: RequestOptions) {
    return this.request(url, { ...options, method: RequestMethods.DELETE });
  }

  static request(url: string, options: RequestOptions, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const tmpXHR = new XMLHttpRequest();
      const method = options.method === undefined ? RequestMethods.GET : options.method;
      tmpXHR.open(method, url);
      tmpXHR.timeout = options.timeout !== undefined ? options.timeout : timeout;
      tmpXHR.withCredentials = true;

      if ('headers' in options && typeof options.headers === 'object') {
        for (const curHeader of Object.keys(options.headers)) {
          tmpXHR.setRequestHeader(curHeader, options.headers[curHeader]);
        }
      }
      tmpXHR.onerror = () => {
        reject(Error('Error!'));
      };
      tmpXHR.ontimeout = () => {
        reject(Error('Timeout!'));
      };
      tmpXHR.onreadystatechange = () => {
        if (tmpXHR.readyState === 4) {
          if (tmpXHR.status >= 400) {
            reject(tmpXHR);
          } else {
            resolve(tmpXHR);
          }
        }
      };
      if (options.isFormData !== undefined) {
        tmpXHR.send(options.formData);
      } else if ('data' in options && typeof options.data === 'object') {
        tmpXHR.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        tmpXHR.send(JSON.stringify(options.data));
      } else {
        tmpXHR.send();
      }
    });
  }
}

/* eslint max-classes-per-file: "off" */
// выключаю, так как это не класс, а обертка
export function withBaseUrlAndHeaders(baseurl: string): RequestClass {
  const overHeaders = {
    accept: 'application/json',
  };
  return class extends Requests {
    static request(url: string, options: RequestOptions, timeout = 5000) {
      const headers = { ...overHeaders, ...options.headers };
      return super.request(baseurl + url, { ...options, headers }, timeout);
    }
  } as RequestClass;
}
