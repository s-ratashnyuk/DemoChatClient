import { BlockList } from '../../../../components/Core/Block/BlockList';
import { ChatItemList } from './chatListItem';
import { ChatItem } from '../../../../models/chatModel';
import { EventBusGlobal } from '../../../../components/Core/EventBus/EventBusGlobal';

export class ChatList extends BlockList {
  constructor() {
    super('ul', { items: {} });
    this.getContent().classList.add('chat-chats-list');
    this.props.items = {} as Record<string, ChatItemList>;
  }

  addItem(props: ChatItem, currentLogin: string): void {
    const el = new ChatItemList({ ...props, currentLogin });
    const items = { ...this.props.items };
    items[`${props.id}`] = el;
    this.setProps({ ...this.props, items });
  }

  removeItem(id: string): void {
    if (!(id in this.props.items)) {
      throw Error('Invalid ID');
    }
    const items = { ...this.props.items };
    delete items[id];
    this.setProps({ ...this.props, items });
  }

  clear() {
    this.setProps({ ...this.props, items: {} });
  }

  componentDidMount() {
    this.getContent().addEventListener('click', this.onClick.bind(this));
  }

  onClick(e: PointerEvent) {
    const el = (e.target as HTMLElement).closest('.chat-chats-list-li-cont');
    if (el) {
      EventBusGlobal.emit('chatItem:click', el.id);
      for (const [, item] of Object.entries(this.props.items as Record<string, ChatItemList>)) {
        if (item.element && el.id === item.element.id) {
          item.setProps({ ...item.props, selected: true });
        } else {
          item.setProps({ ...item.props, selected: false });
        }
      }
    } else {
      throw Error('can not find proper li element');
    }
  }
}
