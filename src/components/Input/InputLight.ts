import { InputBase, InputProps } from './InputBase';
import { InputTemplateOnlyInput } from './InputTemplateOnlyInput';

export class InputLight extends InputBase {
  constructor(props: InputProps) {
    super('div', props);
  }

  render(): string {
    return InputTemplateOnlyInput()(this.props);
  }

  protected get inputElement(): HTMLElement {
    return this.getContent().getElementsByTagName('input')[0];
  }
}
