import Handelbars from 'handlebars';
import { registerComponentPlaceholder } from '../../../../components/Core/RegisterPartials';

const tmpl = `
    <div class="chat-panel-stab">
        <span>Select a chat to start messaging</span>
    </div>
    <div class="chat-panel-wrap hide">
      <header class="chat-panel-header">
          <div class="chat-panel-header-avatar">{{#if userAvatar}} <img src="{{userAvatar}}"/> {{/if}}</div>
          <span class="chat-panel-header-name">{{ userDisplayName }}</span>
          <div class="chat-panel-header-menu">
            {{ButtonComponent 'buttonContextChatMenu'}}
           </div>
      </header>
      {{ChatPanelMessages 'chatPanelMessages'}}
      <footer class="chat-panel-footer">
          <!--<div class="chat-panel-footer-attach"></div>-->
          {{InputComponent 'inputMessage'}}
          {{ButtonComponent 'buttonSend'}}
      </footer>
    </div>
`;

export function chatPanelTmpl(): Function {
  registerComponentPlaceholder('ChatPanelMessages');
  registerComponentPlaceholder('InputComponent');
  registerComponentPlaceholder('ButtonComponent');
  return Handelbars.compile(tmpl);
}
