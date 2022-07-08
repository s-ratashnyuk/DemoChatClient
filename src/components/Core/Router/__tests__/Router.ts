import '@testing-library/jest-dom';
import { getByTestId, waitFor } from '@testing-library/dom';
import { withBlockAsPage } from '../../Block/BlockAsPage';
import { Router } from '../Router';
import { setAuth } from '../../../../utils/authCookies';
import { Login } from '../../../../pages/login/login';
import { Profile } from '../../../../pages/profile/profile';
import { ErrorTypes } from '../../../../pages/errors/errorGeneral';
import { withError } from '../../../../pages/errors/errors';

describe('core/Router', () => {
  const setupRouter = (): Router => {
    const router = new Router({
      rootQuery: 'app',
      page400: withError(ErrorTypes.e400, 'Can not find page'),
      page500: withError(ErrorTypes.e500, 'Server error'),
    });
    router.use('/', withBlockAsPage(Login));
    router.use('/settings', withBlockAsPage(Profile));
    router.start('/');
    return router;
  };

  beforeEach(() => {
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
  });

  afterEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = '';
  });

  it('should render login by default', () => {
    const router = setupRouter();
    expect(getByTestId(document.body, 'buttonLogin')).toBeInTheDocument();
    router.reset();
  });

  it('should not render pages except login without auth', () => {
    const router = setupRouter();
    router.go('/settings');
    expect(getByTestId(document.body, 'buttonLogin')).toBeInTheDocument();
    router.reset();
  });

  it('should render pages except login with auth', () => {
    const router = setupRouter();
    setAuth();
    router.go('/settings');
    expect(getByTestId(document.body, 'buttonChangeProfile')).toBeInTheDocument();
    router.reset();
  });

  it('should render 404 if there is no route', () => {
    const router = setupRouter();
    setAuth();
    router.go('/superurl');
    expect(getByTestId(document.body, 'e400')).toBeInTheDocument();
    router.reset();
  });

  it('should render 500 if called proper method', () => {
    const router = setupRouter();
    setAuth();
    router.show500();
    expect(getByTestId(document.body, 'e500')).toBeInTheDocument();
    router.reset();
  });

  it('should handle onpopstate event', async () => {
    const router = setupRouter();
    setAuth();
    // I can't find more elegant way to fire popstate event inside jest
    window.history.pushState('/settings', '', '/settings');
    window.history.pushState('/settings', '', '/settings');
    window.history.back();

    // give the page time to load
    await waitFor(async () => {
      const t = () => {
        return new Promise((res) => {
          setTimeout(() => {
            res('ok');
          }, 1000);
        });
      };
      await t();
      expect(getByTestId(document.body, 'buttonChangeProfile')).toBeInTheDocument();
      router.reset();
    }, { timeout: 2000 });
  });
});
