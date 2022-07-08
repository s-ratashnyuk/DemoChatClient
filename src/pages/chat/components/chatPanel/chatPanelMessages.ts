import { BlockList } from '../../../../components/Core/Block/BlockList';
import { ChatMessagesItem } from '../chatMessageItem/chatMessagesItem';
import { ChatItem, ChatMessage, MessageTypes } from '../../../../models/chatModel';
import { dateCompare, dateToStr } from '../../../../utils/dateUtils';
import { ChatPanelDateLine } from './chatPanelDateLine';

export class ChatPanelMessages extends BlockList {
  private count: number = 0;

  constructor() {
    super('div', { pleaseScroll: true });
    this.props.items = {} as Record<string, ChatItem>;
    this.getContent().classList.add('chat-panel-window');
  }

  addItem(msgType: MessageTypes, props: ChatMessage): void {
    const mi = new ChatMessagesItem(msgType, props);
    const items = { ...this.props.items };
    items[`id${this.count}`] = mi;
    this.setProps({ ...this.props, items });
    this.count += 1;
  }

  render(): string | null {
    if (this.props.items === undefined) {
      return '';
    }
    const res: Array<string> = [];
    let curDL = new Date('1900-01-01');
    for (const [, el] of Object.entries(this.props.items as Array<ChatMessagesItem>)) {
      if (!dateCompare(curDL, el.props.msg_date_native, 'eq')) {
        curDL = el.props.msg_date_native;
        const dl = new ChatPanelDateLine({
          msg_date: dateToStr(curDL),
        });
        res.push(dl.getContent().outerHTML);
      }
      res.push(el.getContent().outerHTML);
    }
    return res.join('\n');
  }
}
