import Handelbars from 'handlebars';

const chatMyMessageTmpl = `
    {{#each msg_text_arr}}
        <span class="chat-panel-window-message-text">{{ this }}</span>
    {{/each}}
    <span class="chat-panel-window-message-time">{{ msg_date }}</span>
`;

export const chatMyMessage = () => {
  return Handelbars.compile(chatMyMessageTmpl);
};
