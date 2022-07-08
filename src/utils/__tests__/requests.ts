import { queryStringify, withBaseUrlAndHeaders } from '../requests';

describe('utils/requests', () => {
  const baseUrl = 'https://ya-praktikum.tech/api/v2/';

  it('queryStringify should return string with params', () => {
    const data = {
      ab: 123,
      cd: [1, 2, { ef: 123 }],
    };
    expect(queryStringify(data)).toEqual('?ab=123&cd[0]=1&cd[1]=2&cd[2][ef]=123');
  });

  it('should send get requests', async () => {
    const respToBe = {
      id: 123,
      first_name: 'Petya',
      second_name: 'Pupkin',
      display_name: 'Petya Pupkin',
      login: 'userLogin',
      email: 'my@email.com',
      phone: '89223332211',
      avatar: '/path/to/avatar.jpg',
    };
    const req = withBaseUrlAndHeaders(baseUrl);
    const res = await req.get('auth/user');
    expect(JSON.parse(res.response)).toStrictEqual(respToBe);
  });

  it('should emit error on bad post response', () => {
    const req = withBaseUrlAndHeaders(baseUrl);
    return req.post('auth/signin', { login: 'hmstr2' }).catch((e: XMLHttpRequest) => {
      expect(JSON.parse(e.response)).toStrictEqual({ reason: 'string' });
    });
  });

  it('should send post requests', async () => {
    const req = withBaseUrlAndHeaders(baseUrl);
    const res = await req.post('auth/signin', { data: { login: 'hmstr' } });
    expect(JSON.parse(res.response)).toEqual({
      user: 'hmstr',
    });
  });

  it('should send put requests', async () => {
    const req = withBaseUrlAndHeaders(baseUrl);
    const res = await req.put('chat/users');
    expect(res.status).toBe(200);
  });
});
