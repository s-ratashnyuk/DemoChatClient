import UserModel, { UserInfo, UserProfile } from '../models/userModel';
import loginController from './loginController';
import { RequestClass, withBaseUrlAndHeaders } from '../utils/requests';
import { StoreGlobal as Store } from '../components/store';
import { EventBusGlobal } from '../components/Core/EventBus/EventBusGlobal';

class ProfileController {
  private readonly baseUrl: string;

  private req: RequestClass;

  constructor() {
    this.baseUrl = 'https://ya-praktikum.tech/api/v2/';
    this.req = withBaseUrlAndHeaders(this.baseUrl);
  }

  getUserData(): void {
    UserModel.getInfo();
  }

  signOut(): void {
    loginController.logout();
  }

  updateProfile(profile: UserProfile) {
    this.req.put('user/profile', {
      data: {
        ...profile,
      },
    }).then((xhr: XMLHttpRequest) => {
      const res = JSON.parse(xhr.response);
      Store.set('userUpdate', res as UserInfo);
    }).catch((xhr: XMLHttpRequest) => {
      EventBusGlobal.emit('userUpdate:fail', JSON.parse(xhr.response).reason);
    });
  }

  uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);
    this.req.put('user/profile/avatar', {
      isFormData: true,
      formData,
    }).then((xhr: XMLHttpRequest) => {
      const res = JSON.parse(xhr.response);
      Store.set('userAvatarUpdate', res as UserInfo);
    }).catch((xhr: XMLHttpRequest) => {
      EventBusGlobal.emit('userUpdateAvatar:fail', `Error ${xhr.status}`);
    });
  }

  updatePassword(passwords: Record<string, string>) {
    this.req.put('user/password', {
      data: {
        ...passwords,
      },
    }).then(() => {
      EventBusGlobal.emit('userUpdatePassword:success');
    }).catch((xhr: XMLHttpRequest) => {
      EventBusGlobal.emit('userUpdatePassword:fail', JSON.parse(xhr.response).reason);
    });
  }
}

export default new ProfileController();
