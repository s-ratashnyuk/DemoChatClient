import { Block } from '../../../../components/Core/Block/Block';
import { withBlockAsPage } from '../../../../components/Core/Block/BlockAsPage';
import { chatPanelTmpl } from './chatPanel.tmpl';
import { ChatPanelMessages } from './chatPanelMessages';
import { EventBusGlobal } from '../../../../components/Core/EventBus/EventBusGlobal';
import { Button, ButtonTypes } from '../../../../components/Button/Button';
import { handleFormButtonClick } from '../../../../components/Core/EventHandler';
import { InputBase, TemplateTypes } from '../../../../components/Input/InputBase';
import { ChatMessage, MessageTypes } from '../../../../models/chatModel';
import ChatController from '../../../../controllers/chatController';
import { MenuPopup, MenuPopupItemTypes } from '../menuPopup/menuPopup';
import { InputPopUp } from '../inputPopUp/inputPopUp';
import { InputLight } from '../../../../components/Input/InputLight';
import { validateMessage } from '../../../../components/Core/Validators';
import { StoreGlobal as Store } from '../../../../components/store';
import { timeOrDate } from '../../../../utils/dateUtils';

const popupMenuProps = {
  items: {
    addUserToChat: {
      name: 'Add user to chat',
      menuItemType: MenuPopupItemTypes.ADD,
    },
    removeUserFromChat: {
      name: 'Del user from chat',
      menuItemType: MenuPopupItemTypes.DELETE,
    },
    removeChat: {
      name: 'Del chat',
      menuItemType: MenuPopupItemTypes.DELETE,
    },
  },
};

export function createChatPanelElements() {
  const inputMessage = new InputLight({
    form_element_id: 'message',
    form_element_name: 'Message',
    template_type: TemplateTypes.ONLY_INPUT,
    validator: validateMessage,
  });

  const buttonSend = new Button({
    button_name: '',
    button_id: 'buttonSend',
    button_type: ButtonTypes.SEND,
  });

  const buttonContextChatMenu = new Button({
    button_name: '',
    button_id: 'buttonContextChatMenu',
    button_type: ButtonTypes.LINK,
  });

  const chatPanelMessages = new ChatPanelMessages();

  const inputElements = { inputMessage };

  const buttonElements = { buttonSend, buttonContextChatMenu };

  return { inputElements, buttonElements, chat: { chatPanelMessages } };
}

export class ChatPanel extends Block {
  private chatPanelMessages: ChatPanelMessages;

  private readonly inputElements: Record<string, InputBase>;

  private readonly contextMenu: MenuPopup;

  private readonly inputPopUp: InputPopUp;

  constructor() {
    const { inputElements, buttonElements, chat } = createChatPanelElements();
    const props = {
      childElements: {
        ...inputElements, ...buttonElements, ...chat,
      },
    };
    super('div', props);
    this.chatPanelMessages = chat.chatPanelMessages as ChatPanelMessages;
    this.inputElements = inputElements;
    this.getContent().classList.add('chat-panel-right');
    this.addHandler(EventBusGlobal, 'chatStarted', this.handleChatStarted.bind(this));
    this.addHandler(EventBusGlobal, 'button:click', this.handleButtonClick.bind(this));
    this.addHandler(EventBusGlobal, 'newChatMessages', this.handleGetNewMessages.bind(this));
    this.addHandler(EventBusGlobal, 'input:submit', this.handleSendByEnter.bind(this));
    this.addHandler(EventBusGlobal, 'popup:click', this.handleContextMenuClick.bind(this));
    this.addHandler(EventBusGlobal, 'removeChat:success', this.handleRemoveChatSuccess.bind(this));
    this.addHandler(EventBusGlobal, 'inputPopUp:addUser', this.handleAddUser.bind(this));
    this.addHandler(EventBusGlobal, 'inputPopUp:removeUser', this.handleRemoveUser.bind(this));

    this.contextMenu = new MenuPopup(popupMenuProps);
    this.inputPopUp = new (withBlockAsPage(InputPopUp) as typeof InputPopUp)();
  }

  addItem(msgType: MessageTypes, props: ChatMessage): void {
    this.chatPanelMessages.addItem(msgType, props);
  }

  render(): string | null {
    return chatPanelTmpl()(this.props);
  }

  handleChatStarted() {
    this.chatPanelMessages.clear();
    this.getContent().getElementsByClassName('chat-panel-stab')[0].classList.add('hide');
    this.getContent().getElementsByClassName('chat-panel-wrap')[0].classList.remove('hide');
  }

  handleGetNewMessages(res: Array<ChatMessage>) {
    for (const el of res) {
      this.chatPanelMessages.addItem(el.msg_type, { ...el });
    }
    if (res.length > 0) {
      const lastMessage = res[res.length - 1];
      EventBusGlobal.emit('updateChatList', {
        last_message_time: timeOrDate(lastMessage.msg_date_native as Date, 'short'),
        last_message_author: lastMessage.msg_type === MessageTypes.MY ? Store.getStore().userInfo.login : '',
        last_message_content: lastMessage.msg_text,
      });
    }
  }

  handleButtonClick(e: Button) {
    switch (e.props.button_id) {
      case 'buttonSend':
        this.sendMessageByButton();
        break;
      case 'buttonContextChatMenu':
        this.contextMenu.show('50px', '80vw');
        break;
      default:
        // do nothing
    }
  }

  sendMessageByButton() {
    const res = handleFormButtonClick({ inputMessage: this.inputElements.inputMessage });
    if (res.result && res.values) {
      ChatController.sendMessage({
        type: 'message',
        content: res.values.inputMessage,
      });
      this.inputElements.inputMessage.inputValue = '';
    }
  }

  handleSendByEnter() {
    this.sendMessageByButton();
  }

  handleAddUser(data: string) {
    ChatController.addUserToChat(data);
  }

  handleRemoveUser(data: string) {
    ChatController.removeUserFromChat(data);
  }

  handleRemoveChat() {
    ChatController.removeChat();
  }

  handleRemoveChatSuccess() {
    this.getContent().getElementsByClassName('chat-panel-wrap')[0].classList.add('hide');
    this.getContent().getElementsByClassName('chat-panel-stab')[0].classList.remove('hide');
  }

  handleContextMenuClick(e: string) {
    switch (e) {
      case 'addUserToChat':
        this.inputPopUp.showPopUp('inputPopUp:addUser');
        break;
      case 'removeUserFromChat':
        this.inputPopUp.showPopUp('inputPopUp:removeUser');
        break;
      case 'removeChat':
        this.handleRemoveChat();
        break;
      default:
        // do nothing
    }
  }
}
