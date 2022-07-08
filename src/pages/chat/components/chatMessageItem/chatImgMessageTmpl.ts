import Handelbars from 'handlebars';

const chatImgMessageTmpl = `
    <img alt="image message" class="chat-panel-window-message-text" src="{{ img_link }}"/>
    <span class="chat-panel-window-message-time">{{ msg_date }}</span>
`;

export const chatImgMessage = () => {
  return Handelbars.compile(chatImgMessageTmpl);
};
