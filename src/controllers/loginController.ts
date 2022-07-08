import { removeAuth, setAuth } from '../utils/authCookies';
import { EventBusGlobal } from '../components/Core/EventBus/EventBusGlobal';
import { RequestClass, withBaseUrlAndHeaders } from '../utils/requests';

class LoginController {
  private readonly baseUrl: string;

  private req: RequestClass;

  constructor() {
    this.baseUrl = 'https://ya-praktikum.tech/api/v2/';
    this.req = withBaseUrlAndHeaders(this.baseUrl);
  }

  login(login: string, password: string) {
    return this.req.post('auth/signin', {
      data: {
        login, password,
      },
    }).then(() => {
      setAuth();
      EventBusGlobal.emit('login:success');
    }).catch((xhr: XMLHttpRequest) => {
      EventBusGlobal.emit('login:fail', JSON.parse(xhr.response).reason);
    });
  }

  logout() {
    removeAuth();
    return this.req.post('auth/logout').then(() => {
      EventBusGlobal.emit('logout:success');
    }).catch((xhr: XMLHttpRequest) => {
      EventBusGlobal.emit('logout:fail', JSON.parse(xhr.response).reason);
    });
  }

  async doLogin(login: string, password: string) {
    await this.logout();
    this.login(login, password);
  }
}

export default new LoginController();
