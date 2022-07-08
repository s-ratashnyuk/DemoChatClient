import UserModel from '../models/userModel';
import { ChatMessage, MessageTypes } from '../models/chatModel';
import { StoreGlobal as Store } from '../components/store';
import { EventBusGlobal } from '../components/Core/EventBus/EventBusGlobal';
import { timeOrDate } from '../utils/dateUtils';
import { RequestClass, withBaseUrlAndHeaders } from '../utils/requests';
import { AddressHash } from '../components/Core/AddressHash';

class ChatController {
  private wsConnection: WebSocket;

  private readonly baseUrl: string;

  private readonly baseWSUrl: string;

  private readonly req: RequestClass;

  private siTimer: unknown;

  public currentChatId: number;

  constructor() {
    EventBusGlobal.on('chatStarted', this.handleChatStarted.bind(this));
    this.baseUrl = 'https://ya-praktikum.tech/api/v2/';
    this.baseWSUrl = 'wss://ya-praktikum.tech';
    this.req = withBaseUrlAndHeaders(this.baseUrl);
  }

  init() {
    (async () => {
      await this.getUserData();
      this.getChatList();
    })();
  }

  getUserData() {
    UserModel.getInfo();
  }

  getChatList() {
    const title = AddressHash.getHash().chatFilter;
    const data = title ? { data: { title } } : {};
    this.req.get('chats', data).then((xhr: XMLHttpRequest) => {
      const response = JSON.parse(xhr.response);
      const res = [];
      for (const el of response) {
        const curChat = {
          id: el.id,
          title: el.title,
          avatar: el.avatar,
          unread_count: el.unread_count,
          last_message_time: el.last_message ? timeOrDate(new Date(el.last_message.time), 'short') : '',
          last_message_content: el.last_message ? el.last_message.content : '',
          last_message_author: el.last_message ? el.last_message.user.login : '',
        };
        res.push(curChat);
      }
      Store.set('getChatList', res);
    }).catch((xhr: XMLHttpRequest) => {
      EventBusGlobal.emit('getChatList:fail', JSON.parse(xhr.response).reason);
    });
  }

  createChat(data: string) {
    this.req.post('chats', {
      data: {
        title: data,
      },
    }).then(() => {
      this.getChatList();
    }).catch((xhr: XMLHttpRequest) => {
      EventBusGlobal.emit('chatCreated:fail', JSON.parse(xhr.response).reason);
    });
  }

  startChat(chatID: number) {
    this.currentChatId = chatID;
    this.getToken(chatID).then((token) => {
      const userId = Store.getStore().userInfo.id;
      const ws = this.initWSConnection(userId, chatID, token);
      EventBusGlobal.emit('chatStarted', ws);
    });
  }

  processChatMessages(e: MessageEvent) {
    const msg = JSON.parse(e.data);
    const res: Array<ChatMessage> = [];

    const addItem = (el: Record<string, string | number>): void => {
      if (el.type !== 'message') {
        return;
      }
      const tmpDate = new Date(el.time);

      const curUser = Store.getStore().userInfo.id;
      const tmp: ChatMessage = {
        msg_text: el.content as string,
        msg_date_native: tmpDate,
        msg_date: timeOrDate(tmpDate),
        msg_type: curUser === el.user_id ? MessageTypes.MY : MessageTypes.THEIR,
      };
      res.push(tmp);
    };

    if (Array.isArray(msg)) {
      for (const mEl of msg) {
        addItem(mEl);
      }
    } else {
      addItem(msg);
    }

    const reSorted = res.sort((a, b) => {
      if (a.msg_date_native === b.msg_date_native) {
        return 0;
      }
      if (a.msg_date_native === undefined || b.msg_date_native === undefined) {
        return 0;
      }
      if (a.msg_date_native > b.msg_date_native) {
        return 1;
      }
      return -1;
    });
    EventBusGlobal.emit('newChatMessages', reSorted);
  }

  initWS() {
    this.siTimer = setInterval(() => {
      if (this.wsConnection.readyState !== 1) {
        this.wsConnection.close();
        this.startChat(this.currentChatId);
      } else {
        this.wsConnection.send(JSON.stringify({
          type: 'ping',
        }));
      }
    }, 10000);
    this.wsConnection.send(JSON.stringify({
      type: 'get old',
      content: '0',
    }));
  }

  handleChatStarted(ws: WebSocket) {
    if (this.wsConnection) {
      this.wsConnection.removeEventListener('message', this.processChatMessages);
      this.wsConnection.removeEventListener('open', this.initWS.bind(this));
      clearInterval(this.siTimer as number);
      this.wsConnection.close();
    }
    this.wsConnection = ws;
    this.wsConnection.addEventListener('message', this.processChatMessages);
    this.wsConnection.addEventListener('open', this.initWS.bind(this));
  }

  sendMessage(data: Record<string, string>) {
    if (this.wsConnection.readyState === 1) {
      this.wsConnection.send(JSON.stringify(data));
    }
  }

  addUserToChat(userLogin: string) {
    (async () => {
      const userId = await UserModel.getUserByLogin(userLogin);
      this.req.put('chats/users', {
        data: {
          users: [userId],
          chatId: this.currentChatId,
        },
      }).then(() => {
        EventBusGlobal.emit('addUserToChat:success');
      }).catch((xhr: XMLHttpRequest) => {
        EventBusGlobal.emit('addUserToChat:fail', JSON.parse(xhr.response).reason);
      });
    })();
  }

  removeUserFromChat(userLogin: string) {
    (async () => {
      const userId = await UserModel.getUserByLogin(userLogin);
      this.req.delete('chats/users', {
        data: {
          users: [userId],
          chatId: this.currentChatId,
        },
      }).then(() => {
        EventBusGlobal.emit('removeUserFromChat:success');
      }).catch((xhr: XMLHttpRequest) => {
        EventBusGlobal.emit('removeUserFromChat:fail', JSON.parse(xhr.response).reason);
      });
    })();
  }

  removeChat() {
    this.req.delete('chats', {
      data: { chatId: this.currentChatId },
    }).then(() => {
      EventBusGlobal.emit('removeChat:success');
    }).catch((xhr: XMLHttpRequest) => {
      EventBusGlobal.emit('removeChat:fail', JSON.parse(xhr.response).reason);
    });
  }

  getToken(chatId: number) {
    return (async () => {
      const xhr = await this.req.post(`chats/token/${chatId}`);
      return JSON.parse(xhr.response).token;
    })();
  }

  initWSConnection(userId: number, chatId: number, token: string) {
    const ws = new WebSocket(`${this.baseWSUrl}/ws/chats/${userId}/${chatId}/${token}`);
    return ws;
  }
}

export default new ChatController();
