import '@testing-library/jest-dom';
import { getByTestId, queryByAttribute, waitFor } from '@testing-library/dom';
import { Login } from '../login';
import { EventBusGlobal } from '../../../components/Core/EventBus/EventBusGlobal';
import { withBlockAsPage } from '../../../components/Core/Block/BlockAsPage';
import { elementsPlacer } from '../../../components/Core/ElementsPlacer';
import { isLoggedIn } from '../../../utils/authCookies';
import { registerHandlers } from '../../../components/Core/EventHandler';

describe('pages/Login', () => {
  const renderLoginPage = () => {
    const login = new (withBlockAsPage(Login))();
    elementsPlacer(document.getElementById('app') as HTMLElement, { login });
    return login;
  };

  beforeEach(() => {
    document.body.innerHTML = `
    <div id="app">
        <div class="login"></div>
    </div>
    `;
  });

  registerHandlers();

  it('should render page', () => {
    const login = renderLoginPage();
    expect(getByTestId(document.body, 'buttonLogin')).toBeInTheDocument();
    login.componentWillRemove();
  });

  it('should show alert when bad input', () => {
    const login = renderLoginPage();
    const inputLogin = queryByAttribute('id', document.body, 'login') as HTMLInputElement;
    inputLogin.value = 'hm';
    inputLogin.focus();
    inputLogin.blur();
    const alert = getByTestId(document.body, 'login-alert');
    expect(alert).toBeInTheDocument();
    if (alert.textContent !== null) {
      expect(alert.textContent.length).toBeGreaterThan(0);
    }
    login.componentWillRemove();
  });

  it('should login with proper login and password', async () => {
    const login = renderLoginPage();

    const inputLogin = queryByAttribute('id', document.body, 'login') as HTMLInputElement;
    inputLogin.value = 'hmstr';

    const inputPassword = queryByAttribute('id', document.body, 'password') as HTMLInputElement;
    inputPassword.value = 'qqqWWWee4e111';

    const mock = jest.fn();
    EventBusGlobal.on('route', mock);

    const button = getByTestId(document.body, 'buttonLogin');
    button.click();

    await waitFor(() => {
      expect(document.cookie).toBe('isLoggedIn=1');
      expect(mock).toHaveBeenCalled();
      login.componentWillRemove();
    });
  });

  it('should show popup with non valid login and password', async () => {
    const login = renderLoginPage();

    const inputLogin = queryByAttribute('id', document.body, 'login') as HTMLInputElement;
    inputLogin.value = 'hm';

    const inputPassword = queryByAttribute('id', document.body, 'password') as HTMLInputElement;
    inputPassword.value = 'qqqWWWeee';

    const button = getByTestId(document.body, 'buttonLogin');
    button.click();

    await waitFor(() => {
      expect(getByTestId(document.body, 'errorPopup')).toBeVisible();
      expect(isLoggedIn()).toBe(false);
      login.componentWillRemove();
    });
  });

  it('should show popup if login error', async () => {
    const login = renderLoginPage();

    const inputLogin = queryByAttribute('id', document.body, 'login') as HTMLInputElement;
    inputLogin.value = 'hmstr2';

    const inputPassword = queryByAttribute('id', document.body, 'password') as HTMLInputElement;
    inputPassword.value = 'qqqWWWeee1';

    const button = getByTestId(document.body, 'buttonLogin');
    button.click();

    await waitFor(() => {
      expect(getByTestId(document.body, 'errorPopup')).toBeVisible();
      expect(isLoggedIn()).toBe(false);
      login.componentWillRemove();
    });
  });
});
