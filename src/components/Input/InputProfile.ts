import { InputBase, InputProps } from './InputBase';
import { InputTemplateProfile } from './inputTemplateProfile';

export class InputProfile extends InputBase {
  constructor(props: InputProps) {
    super('div', props);
    this.getContent().classList.add('right-panel-form-element');
  }

  render(): string {
    return InputTemplateProfile()(this.props);
  }

  protected get inputElement(): HTMLElement {
    return this.getContent().getElementsByTagName('input')[0];
  }

  showAlert(): void {
    this.getContent().getElementsByTagName('label')[0].classList.add('label-alert');
  }

  hideAlert(): void {
    this.getContent().getElementsByTagName('label')[0].classList.remove('label-alert');
  }
}
