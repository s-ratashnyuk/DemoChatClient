import { Button } from '../../components/Button/Button';
import { handleFormButtonClick } from '../../components/Core/EventHandler';
import { EventBusGlobal } from '../../components/Core/EventBus/EventBusGlobal';
import { Block, Props } from '../../components/Core/Block/Block';
import { profileTmpl } from './profile.tmpl';
import { UserInfo } from '../../models/userModel';
import { StoreGlobal as Store } from '../../components/store';
import ProfileController from '../../controllers/profileController';
import PopUp from '../../components/PopUp/PopUp';
import { createProfileElements } from '../../components/formElements';
import { InputBase } from '../../components/Input/InputBase';
import './profile.less';

enum FormBlocks {
  generalFields = 'right-panel-form',
  passwordFields = 'right-panel-password',
  generalActions = 'right-panel-action-manage',
  saveAction = 'right-panel-action-save',
}

enum FormState {
  general = 'general',
  editProfile = 'editProfile',
  changePassword = 'changePassword',
}

const FormStates = {
  general: {
    hide: [
      FormBlocks.passwordFields,
      FormBlocks.saveAction,
    ],
    show: [
      FormBlocks.generalFields,
      FormBlocks.generalActions,
    ],
  },
  editProfile: {
    hide: [
      FormBlocks.generalActions,
      FormBlocks.passwordFields,
    ],
    show: [
      FormBlocks.generalFields,
      FormBlocks.saveAction,
    ],
  },
  changePassword: {
    hide: [
      FormBlocks.generalActions,
      FormBlocks.generalFields,
    ],
    show: [
      FormBlocks.passwordFields,
      FormBlocks.saveAction,
    ],
  },
};

export class Profile extends Block {
  private readonly inputElements: Record<string, InputBase>;

  private readonly passwordElements: Record<string, InputBase>;

  private avatars: Record<string, Block>;

  private formState: FormState;

  constructor() {
    const {
      buttonElements, inputElements, passwordElements, avatars,
    } = createProfileElements();
    const props: Props = {
      name: 'Profile',
      show_profile: true,
      userName: '',
      childElements: {
        ...inputElements, ...passwordElements, ...buttonElements, ...avatars,
      },
      state: FormStates[FormState.general],
    };
    super('div', props);
    this.inputElements = inputElements;
    this.passwordElements = passwordElements;
    this.avatars = avatars;
    this.formState = FormState.general;
    this.addHandler(EventBusGlobal, 'button:click', this.handleButtonsClick.bind(this));
    this.addHandler(Store, 'userInfo', this.handleGetData.bind(this));
    this.addHandler(Store, 'userUpdate', this.handleProfileUpdateResults);
    this.addHandler(EventBusGlobal, 'logout:success', this.handleSignOut);
    this.addHandler(EventBusGlobal, 'getInfo:fail', this.handleGetDataError);
    this.addHandler(EventBusGlobal, 'userUpdate:fail', this.handleProfileUpdateError);
    this.addHandler(EventBusGlobal, 'userUpdatePassword:success', this.handlePasswordUpdateOK.bind(this));
    this.addHandler(EventBusGlobal, 'userUpdatePassword:fail', this.handlePasswordUpdateError);
    this.addHandler(Store, 'userAvatarUpdate', this.handleAvatarUploadFinish.bind(this));
    ProfileController.getUserData();
  }

  render(): string | null {
    return profileTmpl()(this.props);
  }

  componentDidRender() {
    for (const el of this.props.state.hide) {
      this.getContent().getElementsByClassName(el)[0].classList.add('hide');
    }
    for (const el of this.props.state.show) {
      this.getContent().getElementsByClassName(el)[0].classList.remove('hide');
    }
    if (this.formState === FormState.editProfile || this.formState === FormState.general) {
      const isReadonly = this.formState === FormState.general;
      for (const [, el] of Object.entries(this.inputElements)) {
        el.setProps({ ...el.props, is_readonly: isReadonly });
      }
    }
  }

  handlePasswordUpdateError(data: string) {
    PopUp.showPopup({
      header: 'Password change error',
      body: data,
    });
  }

  handlePasswordUpdateOK() {
    this.formState = FormState.general;
    this.setProps({ ...this.props, state: FormStates.general });
  }

  handleAvatarUploadFinish(data: UserInfo) {
    this.handleGetData(data);
  }

  handleGetData(data: UserInfo) {
    for (const [, el] of Object.entries(this.inputElements)) {
      const curKey = el.props.form_element_id;
      if (curKey in data) {
        el.setProps({ value: data[curKey as keyof UserInfo] });
      }
    }
    if (data.avatar !== null) {
      this.avatars.avatar.setProps({
        ...this.avatars.avatar.props,
        avatarImg: `https://ya-praktikum.tech/api/v2/resources/${data.avatar}`,
      });
    }
    this.setProps({ ...this.props, displayName: this.inputElements.inputDisplayName.inputValue });
  }

  handleButtonsClick(e: Button):void {
    switch (e.props.button_id) {
      case 'buttonSave':
        if (this.formState === FormState.editProfile) {
          this.handleProfileSave();
        }
        if (this.formState === FormState.changePassword) {
          this.handlePasswordSave();
        }
        break;
      case 'buttonSignOut':
        ProfileController.signOut();
        break;
      case 'buttonChangeProfile':
        this.handleChangeProfile();
        break;
      case 'buttonChangePassword':
        this.handleChangePassword();
        break;
      case 'buttonCancelSave':
        this.handleCancelSave();
        break;
      case 'buttonBack':
        window.history.back();
        break;
      default:
        // do nothing
    }
  }

  handlePasswordSave() {
    const res = handleFormButtonClick(this.passwordElements);
    if (res.result && res.values) {
      ProfileController.updatePassword({
        oldPassword: res.values.inputOldPassword,
        newPassword: res.values.inputNewPassword,
      });
    } else {
      PopUp.showPopup({
        header: 'Validation error',
        body: 'Some fields are invalid',
      });
    }
  }

  handleProfileSave() {
    const res = handleFormButtonClick(this.inputElements);
    if (res.result && res.values) {
      ProfileController.updateProfile({
        login: res.values.inputLogin,
        email: res.values.inputEmail,
        phone: res.values.inputPhone,
        first_name: res.values.inputFirstName,
        second_name: res.values.inputSecondName,
        display_name: res.values.inputDisplayName,
      });
    } else {
      PopUp.showPopup({
        header: 'Validation error',
        body: 'Some fields are invalid',
      });
    }
  }

  handleProfileUpdateResults() {
    EventBusGlobal.emit('route', '/settings');
  }

  handleProfileUpdateError(data: string) {
    PopUp.showPopup({
      header: 'Update fail',
      body: data,
    });
  }

  handleGetDataError() {
    PopUp.showPopup({
      header: 'Can not get data',
      body: 'Possible user not authorized',
      canNotClose: true,
    });
  }

  handleCancelSave() {
    this.formState = FormState.general;
    this.setProps({ ...this.props, state: FormStates.general });
  }

  handleChangeProfile() {
    this.formState = FormState.editProfile;
    this.setProps({ ...this.props, state: FormStates.editProfile });
  }

  handleChangePassword() {
    this.formState = FormState.changePassword;
    this.setProps({ ...this.props, state: FormStates.changePassword });
  }

  handleSignOut() {
    EventBusGlobal.emit('route', '/');
  }
}
