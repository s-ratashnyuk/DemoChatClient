import { ButtonTemplateGeneral, ButtonTemplateLink } from './ButtonTemplate';
import { Block } from '../Core/Block/Block';
import { EventBusGlobal } from '../Core/EventBus/EventBusGlobal';

export enum ButtonTypes {
  AZUL = 'button-azul',
  SEND = 'button-send',
  BACK = 'button-back',
  LINK = 'button-as-link',
  ADD = 'button-add',
}

type ButtonProps = {
  button_name: string,
  button_id: string,
  button_type?: ButtonTypes,
  parent_class?: string,
  show_as_error?: boolean,
  data_test_id?: string,
};

const buttonPropsDefaults = {
  button_type: ButtonTypes.AZUL,
};

export class Button extends Block {
  constructor(props: ButtonProps) {
    super('div', { ...buttonPropsDefaults, ...props });
    this.getContent().classList.remove('general-block-class');
    if (this.props.parent_class) {
      this.getContent().classList.add(this.props.parent_class);
    }
  }

  render(): string | null {
    switch (this.props.button_type) {
      case ButtonTypes.AZUL:
      case ButtonTypes.SEND:
      case ButtonTypes.BACK:
      case ButtonTypes.ADD:
        return ButtonTemplateGeneral()(this.props);
      case ButtonTypes.LINK:
        return ButtonTemplateLink()(this.props);
      default:
        throw Error('Unknown button type');
    }
  }

  componentDidRender() {
    const btn = this.getContent();
    const self = this;
    btn.onclick = (e: Event) => {
      e.preventDefault();
      EventBusGlobal.emit('button:click', self);
    };
  }

  componentWillRemove() {
    super.componentWillRemove();
    const btn = this.getContent();
    btn.onclick = null;
  }
}
