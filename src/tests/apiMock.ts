// eslint хочет увидеть этот пакет в общих зависимостях, а не только "для разработки"
import { setupServer } from 'msw/node'; // eslint-disable-line
import { rest } from 'msw'; // eslint-disable-line

const baseUrl = 'https://ya-praktikum.tech/api/v2/';

const handlers = [
  rest.post(`${baseUrl}auth/signin`, (params: any, res, ctx) => {
    const { login } = params.body;
    if (login === 'hmstr') {
      return res(
        ctx.status(200),
        ctx.json({
          user: 'hmstr',
        }),
      );
    }
    return res(
      ctx.status(401),
      ctx.json({
        reason: 'string',
      }),
    );
  }),
  rest.post(`${baseUrl}auth/logout`, (_, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.get(`${baseUrl}auth/user`, (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: 123,
        first_name: 'Petya',
        second_name: 'Pupkin',
        display_name: 'Petya Pupkin',
        login: 'userLogin',
        email: 'my@email.com',
        phone: '89223332211',
        avatar: '/path/to/avatar.jpg',
      }),
    );
  }),
  rest.put(`${baseUrl}chat/users`, (_, res, ctx) => {
    return res(ctx.status(200));
  }),

];

export const server = setupServer(...handlers);
