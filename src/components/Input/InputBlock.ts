import { InputBase, InputProps } from './InputBase';

export class InputBlock extends InputBase {
  constructor(props: InputProps) {
    super('div', props);
  }

  protected get inputElement(): HTMLElement {
    return this.getContent().getElementsByTagName('input')[0];
  }
}
