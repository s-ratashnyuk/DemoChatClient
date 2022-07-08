import { RequestClass, withBaseUrlAndHeaders } from '../utils/requests';
import { StoreGlobal as Store } from '../components/store';
import { EventBusGlobal } from '../components/Core/EventBus/EventBusGlobal';

export type UserProfile = {
  login: string,
  email: string,
  first_name: string,
  second_name: string,
  phone: string,
  display_name?: string,
  avatar?: string,
};

export type UserInfo = UserProfile & { id: number };

export enum RequestState {
  SUCCESS,
  FAIL,
}

export type RequestMessage = {
  result: RequestState,
  data?: unknown,
};

class UserModel {
  private readonly baseUrl: string;

  private req: RequestClass;

  constructor() {
    this.baseUrl = 'https://ya-praktikum.tech/api/v2/';
    this.req = withBaseUrlAndHeaders(this.baseUrl);
  }

  getInfo() {
    this.req.get('auth/user').then((xhr: XMLHttpRequest) => {
      const res = JSON.parse(xhr.response);
      Store.set('userInfo', res as UserInfo);
    }).catch((xhr: XMLHttpRequest) => {
      EventBusGlobal.emit('getInfo:fail', JSON.parse(xhr.response).reason);
    });
  }

  getUserByLogin(login: string) {
    return this.req.post('user/search', {
      data: {
        login,
      },
    }).then((xhr: XMLHttpRequest) => {
      const res = JSON.parse(xhr.response);
      if (Array.isArray(res) && res.length > 0) {
        return res[0].id;
      }
      throw Error('Can not find user');
    });
  }
}

export default new UserModel();
