import Handelbars from 'handlebars';
import { Block } from '../../../../components/Core/Block/Block';

const tmpl = '<span>{{ msg_date }}</span>';

type ChatPanelDateProps = {
  msg_date: string,
};

export class ChatPanelDateLine extends Block {
  constructor(props: ChatPanelDateProps) {
    super('div', props);
    this.getContent().classList.add('chat-panel-window-date');
  }

  render(): string | null {
    return Handelbars.compile(tmpl)(this.props);
  }
}
