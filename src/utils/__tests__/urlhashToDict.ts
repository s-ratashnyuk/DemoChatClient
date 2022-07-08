import { urlhashToDict } from '../urlhashToDict';

describe('utils/urlToHash', () => {
  it('should return object', () => {
    expect(urlhashToDict('#chatId=456&filter=&login=hmstr')).toEqual({
      chatId: '456',
      filter: '',
      login: 'hmstr',
    });
  });
});
