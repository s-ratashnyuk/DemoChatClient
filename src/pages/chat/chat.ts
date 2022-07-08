import { Button } from '../../components/Button/Button';
import { EventBusGlobal } from '../../components/Core/EventBus/EventBusGlobal';
import { Block } from '../../components/Core/Block/Block';
import { withBlockAsPage } from '../../components/Core/Block/BlockAsPage';
import { chatTmpl } from './chat.tmpl';
import { createChatElements } from '../../components/formElements';
import { StoreGlobal as Store } from '../../components/store';
import ChatController from '../../controllers/chatController';
import { ChatItem } from '../../models/chatModel';
import { ChatList } from './components/chatList/chatList';
import { InputPopUp } from './components/inputPopUp/inputPopUp';
import './chat.less';
import { InputBase } from '../../components/Input/InputBase';
import { AddressHash } from '../../components/Core/AddressHash';

export class Chat extends Block {
  private readonly inputPopUp: InputPopUp;

  private readonly chatList: ChatList;

  constructor() {
    const { inputElements, buttonElements, chat } = createChatElements();
    const props = {
      name: 'Chat',
      childElements: {
        ...inputElements, ...buttonElements, ...chat,
      },
    };
    super('div', props);
    this.chatList = chat.chatList as ChatList;
    this.addHandler(EventBusGlobal, 'button:click', this.handleButtonClick.bind(this));
    this.addHandler(EventBusGlobal, 'inputPopUp:createChat', this.handleInputPopUpData.bind(this));
    this.addHandler(EventBusGlobal, 'chatItem:click', this.handleSelectChat.bind(this));
    this.addHandler(EventBusGlobal, 'input:submit', this.handleSubmitSearch.bind(this));
    this.addHandler(Store, 'getChatList', this.chatInitComplete.bind(this));
    this.addHandler(EventBusGlobal, 'removeChat:success', this.handleRemoveChatSuccess.bind(this));
    this.addHandler(EventBusGlobal, 'updateChatList', this.handleHaveToUpdateChatList.bind(this));
    this.inputPopUp = new (withBlockAsPage(InputPopUp) as typeof InputPopUp)();
    AddressHash.parseAddress();
    if (AddressHash.getHash().chatFilter !== '') {
      this.props.childElements.inputSearch.inputValue = AddressHash.getHash().chatFilter;
    }
    ChatController.init();
  }

  render(): string | null {
    return chatTmpl()(this.props);
  }

  handleSelectChat(chatId: number) {
    if (!(chatId in this.chatList.props.items)) {
      EventBusGlobal.emit('removeChat:success');
      return;
    }
    ChatController.startChat(chatId);
    const el = this.chatList.props.items[chatId];
    el.setProps({ ...el.props, unread_count: 0, selected: true });

    AddressHash.setHash('chatId', chatId.toString());
    window.location.hash = AddressHash.getUrlHash();
  }

  handleHaveToUpdateChatList(data: Record<string, string>) {
    const el = this.chatList.props.items[ChatController.currentChatId];
    el.setProps({ ...el.props, ...data });
  }

  handleInputPopUpData(data: string) {
    ChatController.createChat(data);
  }

  chatInitComplete(data: Array<ChatItem>) {
    this.chatList.clear();
    for (const el of data) {
      const me = Store.getStore().userInfo.login;
      this.chatList.addItem(el, me);
    }
    if (AddressHash.getHash().chatId) {
      this.handleSelectChat(Number(AddressHash.getHash().chatId));
    }
  }

  handleButtonClick(e: Button) {
    switch (e.props.button_id) {
      case 'buttonAddChat':
        this.inputPopUp.showPopUp('inputPopUp:createChat');
        break;
      default:
        // do nothing
    }
  }

  handleSubmitSearch(e: InputBase) {
    if (e.props.form_element_id !== 'search') {
      return;
    }
    AddressHash.setHash('chatFilter', e.inputValue);
    window.location.hash = AddressHash.getUrlHash();
    this.handleChatListFilter();
  }

  handleChatListFilter() {
    ChatController.getChatList();
  }

  handleRemoveChatSuccess() {
    ChatController.init();
  }
}
