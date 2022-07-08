import { Button, ButtonTypes } from '../../../../components/Button/Button';
import { avatarLoadTmpl } from './avatarLoad.tmpl';
import { Block, Props } from '../../../../components/Core/Block/Block';
import { EventBusGlobal } from '../../../../components/Core/EventBus/EventBusGlobal';
import { StoreGlobal as Store } from '../../../../components/store';
import ProfileController from '../../../../controllers/profileController';

const buttonChangeAvatar = new Button({
  button_name: 'Change',
  button_id: 'buttonChangeAvatar',
  button_type: ButtonTypes.AZUL,
});

const buttonChangeAvatarClose = new Button({
  button_name: 'Close',
  button_id: 'buttonChangeAvatarClose',
  button_type: ButtonTypes.LINK,
});

const buttonChooseFile = new Button({
  button_name: 'Choose file',
  button_id: 'buttonChooseFile',
  button_type: ButtonTypes.LINK,
});

export class AvatarLoad extends Block {
  constructor() {
    const props: Props = {
      childElements: {
        buttonChangeAvatar, buttonChangeAvatarClose, buttonChooseFile,
      },
    };
    super('div', props);
    this.getContent().classList.remove('general-block-class');
    this.getContent().classList.add('right-panel-change-avatar');
    this.hide();
    this.addHandler(EventBusGlobal, 'updateAvatar:click', this.handleOpenAvatarPopup.bind(this));
    this.addHandler(EventBusGlobal, 'button:click', this.handleButtonsClick.bind(this));
    this.addHandler(EventBusGlobal, 'userUpdateAvatar:fail', this.handleUploadFail.bind(this));
    this.addHandler(Store, 'userAvatarUpdate', this.handleAvatarUploadFinish.bind(this));
  }

  render(): string | null {
    return avatarLoadTmpl()(this.props);
  }

  showAalert(data: string) {
    const el = this.element?.getElementsByClassName('avatar-modal-error')[0];
    if (el !== undefined) {
      el.textContent = data;
    }
  }

  hideAlert() {
    const el = this.element?.getElementsByClassName('avatar-modal-error')[0];
    if (el !== undefined) {
      el.textContent = '';
    }
  }

  handleUploadFail(data: string) {
    this.showAalert(data);
  }

  handleAvatarUploadFinish() {
    this.hide();
  }

  handleChooseFile() {
    const i = document.createElement('input');
    const self = this;
    i.setAttribute('type', 'file');
    i.onchange = () => {
      if (i.files !== null) {
        const file = i.files[0];
        Store.set('fileAvatarChosen', file);
        if (self.element !== null) {
          self.element.getElementsByTagName('span')[0].textContent = file.name;
        }
        buttonChooseFile.hide();
      }
    };
    i.click();
  }

  handleAvatarUpload() {
    const file = Store.pop('fileAvatarChosen') as File;
    if (file !== undefined) {
      ProfileController.uploadAvatar(file);
    }
  }

  handleOpenAvatarPopup() {
    this.show();
  }

  handleButtonsClick(e: Button) {
    switch (e.props.button_id) {
      case 'buttonChangeAvatarClose':
        this.hide();
        break;
      case 'buttonChooseFile':
        this.handleChooseFile();
        break;
      case 'buttonChangeAvatar':
        this.handleAvatarUpload();
        break;
      default:
    }
  }
}
