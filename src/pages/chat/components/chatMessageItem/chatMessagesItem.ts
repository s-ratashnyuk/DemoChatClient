import { Block } from '../../../../components/Core/Block/Block';
import { chatMyMessage } from './chatMyMessageTmpl';
import { chatTheirMessage } from './chatTheirMessageTmpl';
import { chatImgMessage } from './chatImgMessageTmpl';
import { ChatMessage, MessageTypes } from '../../../../models/chatModel';

export class ChatMessagesItem extends Block {
  constructor(msgType: MessageTypes, props: ChatMessage) {
    super('div', { ...props, msgType });
    switch (this.props.msgType) {
      case MessageTypes.THEIR:
        this.getContent().classList.add('chat-panel-window-message');
        break;
      case MessageTypes.MY:
        this.getContent().classList.add('chat-panel-window-message-my');
        break;
      case MessageTypes.IMAGE:
        this.getContent().classList.add('chat-panel-window-message-img');
        break;
      default:
        throw Error('Have to specify msg type');
    }
  }

  render(): string | null {
    const msgTextArr = this.props.msg_text.split('\n');
    switch (this.props.msgType) {
      case MessageTypes.THEIR:
        return chatTheirMessage()({ ...this.props, msg_text_arr: msgTextArr });
      case MessageTypes.MY:
        return chatMyMessage()({ ...this.props, msg_text_arr: msgTextArr });
      case MessageTypes.IMAGE:
        return chatImgMessage()(this.props);
      default:
        return '';
    }
  }
}
