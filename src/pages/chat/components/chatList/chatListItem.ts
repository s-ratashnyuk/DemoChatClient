import Handelbars from 'handlebars';
import { Block, Props } from '../../../../components/Core/Block/Block';

const tmpl = `
    <div class="chat-chats-list-chat">
        <div class="chat-avatar"></div>
        <div class="chat-preview">
            <div class="chat-preview-name">{{ title }}</div>
            <div class="chat-preview-message">
                {{#if hwo_typed}}
                    <span class="chat-preview-message-my">I:</span>
                {{/if}}
                {{ last_message_content }}
            </div>
        </div>
        <div class="chat-count-cont">
            <span class="chat-date">{{ last_message_time }}</span>
            {{#if unread_count}}
                <div class="chat-count"> {{ unread_count }} </div>
            {{/if}}
        </div>
    </div>`;

export class ChatItemList extends Block {
  constructor(props: Props) {
    super('li', props);
    this.getContent().classList.add('chat-chats-list-li-cont');
    this.getContent().id = this.props.id;
  }

  render(): string {
    this.props.hwo_typed = this.props.last_message_author === this.props.currentLogin;
    return Handelbars.compile(tmpl)(this.props);
  }

  componentDidRender() {
    if (!this.element) {
      return;
    }
    const domElement = document.getElementById(this.element.id);
    if (!domElement) {
      return;
    }
    if (this.props.selected) {
      domElement.classList.add('chat-list-item-hovered');
    } else {
      domElement.classList.remove('chat-list-item-hovered');
    }
  }
}
