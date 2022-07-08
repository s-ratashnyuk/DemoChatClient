import { Button } from '../../components/Button/Button';
import { EventBusGlobal } from '../../components/Core/EventBus/EventBusGlobal';
import { handleFormButtonClick } from '../../components/Core/EventHandler';
import { Block } from '../../components/Core/Block/Block';
import { registerTmpl } from './register.tmpl';
import RegisterController from '../../controllers/registerController';
import PopUp from '../../components/PopUp/PopUp';
import { InputBase } from '../../components/Input/InputBase';
import { createRegisterElements } from '../../components/formElements';
import { setAuth } from '../../utils/authCookies';
import './register.less';

export class Register extends Block {
  private readonly inputElements: Record<string, InputBase>;

  constructor() {
    const {
      buttonElements, inputElements, passwordElements,
    } = createRegisterElements();
    const props = {
      name: 'Register',
      childElements: { ...buttonElements, ...inputElements, ...passwordElements },
    };
    super('div', props);
    this.inputElements = { ...inputElements, ...passwordElements };
    this.addHandler(EventBusGlobal, 'button:click', this.handleButtonsClick.bind(this));
    this.addHandler(EventBusGlobal, 'register:success', this.handleRegisterOK);
    this.addHandler(EventBusGlobal, 'register:fail', this.handleRegisterFail);
  }

  render(): string | null {
    return registerTmpl();
  }

  handleButtonsClick(e: Button):void {
    switch (e.props.button_id) {
      case 'buttonRegister':
        this.handleRegister();
        break;
      case 'buttonSignin':
        EventBusGlobal.emit('route', '/');
        break;
      default:
        // do nothing
    }
  }

  handleRegister() {
    const res = handleFormButtonClick(this.inputElements);
    if (res.result && res.values) {
      RegisterController.doRegister({
        login: res.values.inputLogin,
        email: res.values.inputEmail,
        phone: res.values.inputPhone,
        first_name: res.values.inputFirstName,
        second_name: res.values.inputSecondName,
      }, res.values.inputPassword);
    } else {
      PopUp.showPopup({
        header: 'Validation error',
        body: 'Some fields are invalid',
      });
    }
  }

  handleRegisterOK() {
    setAuth();
    EventBusGlobal.emit('route', '/messages');
  }

  handleRegisterFail(data: string) {
    PopUp.showPopup({
      header: 'Register fail',
      body: data,
    });
  }
}
