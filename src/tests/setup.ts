import { server } from './apiMock';

beforeAll(() => { server.listen(); });
afterEach(() => {
  document.getElementsByTagName('html')[0].innerHTML = '';
  document.cookie.split(';').map((e) => {
    const tmp = e.split('=');
    document.cookie = `${tmp[0].trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    return undefined;
  });
  server.resetHandlers();
});
afterAll(() => { server.close(); });

// @ts-ignore
window.is_debug = true;
