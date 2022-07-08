import { InputBase } from '../../components/Input/InputBase';
import { Button } from '../../components/Button/Button';
import { EventBusGlobal } from '../../components/Core/EventBus/EventBusGlobal';
import { handleFormButtonClick } from '../../components/Core/EventHandler';
import { Block } from '../../components/Core/Block/Block';
import LoginController from '../../controllers/loginController';
import { loginTmpl } from './login.tmpl';
import PopUp from '../../components/PopUp/PopUp';
import { createLoginElements } from '../../components/formElements';
import './login.less';

export class Login extends Block {
  private readonly inputElements: Record<string, InputBase>;

  constructor() {
    const {
      buttonElements, inputElements, passwordElements,
    } = createLoginElements();
    const props = {
      name: 'Login',
      childElements: { ...buttonElements, ...inputElements, ...passwordElements },
    };
    super('div', props);
    this.inputElements = { ...inputElements, ...passwordElements };
    this.addHandler(EventBusGlobal, 'button:click', this.handleLoginClick.bind(this));
    this.addHandler(EventBusGlobal, 'login:success', this.handleLoginOK);
    this.addHandler(EventBusGlobal, 'login:fail', this.handleLoginFail);
  }

  render(): string | null {
    return loginTmpl();
  }

  handleLoginClick(e: Button):void {
    switch (e.props.button_id) {
      case 'buttonLogin':
        this.handleLogin();
        break;
      case 'buttonSignup':
        EventBusGlobal.emit('route', '/sign-up');
        break;
      default:
        // do nothing
    }
  }

  handleLogin() {
    const res = handleFormButtonClick(this.inputElements);
    if (res.result && res.values) {
      LoginController.doLogin(res.values.inputLogin, res.values.inputPassword);
    } else {
      PopUp.showPopup({
        header: 'Validation errors',
        body: 'Some fields are invalid',
      });
    }
  }

  handleLoginFail(data: string) {
    PopUp.showPopup({
      header: 'Login fail',
      body: data,
    });
  }

  handleLoginOK() {
    EventBusGlobal.emit('route', '/messages');
  }
}
