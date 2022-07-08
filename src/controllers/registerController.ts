import { UserProfile } from '../models/userModel';
import loginController from './loginController';
import { EventBusGlobal } from '../components/Core/EventBus/EventBusGlobal';
import { RequestClass, withBaseUrlAndHeaders } from '../utils/requests';

class RegisterController {
  private readonly baseUrl: string;

  private req: RequestClass;

  constructor() {
    this.baseUrl = 'https://ya-praktikum.tech/api/v2/';
    this.req = withBaseUrlAndHeaders(this.baseUrl);
  }

  register(profile: UserProfile, password: string) {
    return this.req.post('auth/signup', {
      data: {
        ...profile, password,
      },
    }).then(() => {
      EventBusGlobal.emit('register:success');
    }).catch((xhr: XMLHttpRequest) => {
      EventBusGlobal.emit('register:fail', JSON.parse(xhr.response).reason);
    });
  }

  async doRegister(profile: UserProfile, password: string) {
    await loginController.logout();
    this.register(profile, password);
  }
}

export default new RegisterController();
