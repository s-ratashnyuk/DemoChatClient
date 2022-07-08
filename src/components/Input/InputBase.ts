import { InputTemplateGeneral } from './InputTemplateGeneral';
import { EventBusGlobal } from '../Core/EventBus/EventBusGlobal';
import { Block } from '../Core/Block/Block';
import { InputTemplateOnlyInput } from './InputTemplateOnlyInput';

export enum TemplateTypes {
  GENERAL,
  ONLY_INPUT,
}

export type InputProps = {
  form_element_id: string,
  is_readonly?: boolean,
  form_element_name?: string,
  form_element_placeholder?: string,
  is_password?: boolean,
  is_repeat_password?: boolean,
  password_input?: InputBase,
  validator?: Function | null,
  value?: string,
  alert_text?: string,
  template_type?: TemplateTypes;
};

const inputPropsDefaults = {
  value: '',
  is_readonly: false,
  template_type: TemplateTypes.GENERAL,
  alert_text: '',
  is_password: false,
  form_element_placeholder: '',
};

export class InputBase extends Block {
  private readonly hasPlaceForAlert:boolean = false;

  constructor(tagName: string, props: InputProps) {
    const tmpProps: InputProps = { ...inputPropsDefaults, ...props };
    super(tagName, tmpProps);
    if (this.props.template_type === TemplateTypes.GENERAL) {
      this.hasPlaceForAlert = true;
    }
  }

  protected get inputElement(): HTMLElement {
    return this.getContent().getElementsByTagName('input')[0];
  }

  get inputValue(): string {
    return (this.inputElement as HTMLInputElement).value;
  }

  set inputValue(data: string) {
    (this.inputElement as HTMLInputElement).value = data;
  }

  validate(): boolean {
    if (typeof this.props.validator !== 'function') {
      throw Error('Validator must be set');
    }
    if (this.props.is_repeat_password && this.props.password_input !== undefined) {
      return this.props.validator(this.inputValue, this.props.password_input.inputValue);
    }
    return this.props.validator(this.inputValue);
  }

  render(): string {
    switch (this.props.template_type) {
      case TemplateTypes.GENERAL:
        return InputTemplateGeneral()(this.props);
      case TemplateTypes.ONLY_INPUT:
        return InputTemplateOnlyInput()(this.props);
      default:
        throw Error('InputBlock type must be specified');
    }
  }

  componentDidRender() {
    const self = this;
    this.inputElement.onblur = () => {
      EventBusGlobal.emit('input:blur', self);
    };
    this.inputElement.onfocus = () => {
      EventBusGlobal.emit('input:focus', self);
    };
    this.inputElement.onkeyup = (e) => {
      if (e.key === 'Enter') {
        EventBusGlobal.emit('input:submit', self);
      }
    };
  }

  componentWillRemove() {
    super.componentWillRemove();
    this.inputElement.onblur = null;
    this.inputElement.onfocus = null;
    this.inputElement.onkeyup = null;
  }

  showAlert(): void {
    if (this.hasPlaceForAlert) {
      this.getContent().getElementsByTagName('span')[0].textContent = this.props.alert_text;
    }
  }

  hideAlert(): void {
    if (this.hasPlaceForAlert) {
      this.getContent().getElementsByTagName('span')[0].textContent = '';
    }
  }
}
