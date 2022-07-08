import Handelbars from 'handlebars';

const chatTheirMessageTmpl = `
    {{#each msg_text_arr}}
        <span class="chat-need-break chat-panel-window-message-text">{{ this }}</span>
    {{/each}}
    <span class="chat-panel-window-message-time">{{ msg_date }}</span>
`;

export const chatTheirMessage = () => {
  return Handelbars.compile(chatTheirMessageTmpl);
};
