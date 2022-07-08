import { Block } from '../../../../components/Core/Block/Block';
import { EventBusGlobal } from '../../../../components/Core/EventBus/EventBusGlobal';
import { Button, ButtonTypes } from '../../../../components/Button/Button';
import { inputPopUpTmpl } from './inpuPopUp.tmpl';
import { InputBase } from '../../../../components/Input/InputBase';
import './inputPopUp.less';
import { InputBlock } from '../../../../components/Input/InputBlock';
import { validateMessage } from '../../../../components/Core/Validators';

export function createChatInputPopUp() {
  const inputPopUpText = new InputBlock({
    form_element_id: 'inputPopUpText',
    form_element_name: 'Message',
    alert_text: '',
    validator: validateMessage,
  });

  const buttonInputPopUpOK = new Button({
    button_name: 'OK',
    button_id: 'buttonInputPopUpOK',
  });

  const buttonInputPopUpClose = new Button({
    button_name: 'Close',
    button_id: 'buttonInputPopUpClose',
    button_type: ButtonTypes.LINK,
  });

  return {
    inputElements: { inputPopUpText },
    buttonElements: { buttonInputPopUpOK, buttonInputPopUpClose },
  };
}

export class InputPopUp extends Block {
  private inputElements: Record<string, InputBase>;

  private eventName: string;

  constructor() {
    const { inputElements, buttonElements } = createChatInputPopUp();
    super('div', {
      childElements: { ...inputElements, ...buttonElements },
    });
    this.inputElements = inputElements;
    this.addHandler(EventBusGlobal, 'button:click', this.handleButtonClick.bind(this));
    const el = document.getElementById('app');
    if (el) {
      el.appendChild(this.getContent());
    }
    this.hide();
  }

  showPopUp(eventName: string) {
    this.eventName = eventName;
    this.show();
  }

  handleButtonClick(e: Button) {
    switch (e.props.button_id) {
      case 'buttonInputPopUpOK':
        EventBusGlobal.emit(this.eventName, this.inputElements.inputPopUpText.inputValue);
        this.inputElements.inputPopUpText.inputValue = '';
        this.hide();
        break;
      case 'buttonInputPopUpClose':
        this.inputElements.inputPopUpText.inputValue = '';
        this.hide();
        break;
      default:
        // do nothing
    }
  }

  render(): string | null {
    return inputPopUpTmpl()(this.props);
  }
}
