import Handelbars from 'handlebars';
import { registerComponentPlaceholder } from '../../components/Core/RegisterPartials';

const tmpl = `
<div id="container" class="chat">
    <div class="chat-panel-left">
        <div class="chat-header">
            <div class="chat-header-profile">
                {{ButtonComponent 'buttonAddChat'}}
                <a href="/settings">Profile</a>
            </div>
            <div class="chat-header-search">
                {{InputComponent 'inputSearch'}}
            </div>
        </div>
        <div class="chat-chats-list-cont">
           {{chatListComponent 'chatList'}}
        </div>
    </div>

    {{ChatPanelComponent 'chatPanel'}}
    
    {{#if show_add_user}}
    <div class="chat-dialog-cont">
        <div class="chat-dialog">
            <h2>Add / delete user</h2>
            <div class="form">
                {{> input_partial form_element_id="userid" form_element_name="Login"}}
            </div>
            {{> button_azul button_name="Add"}}
        </div>
    </div>
    {{/if}}
</div>
`;

export const chatTmpl = () => {
  registerComponentPlaceholder('InputComponent');
  registerComponentPlaceholder('ButtonComponent');
  registerComponentPlaceholder('chatListComponent');
  registerComponentPlaceholder('ChatPanelComponent');
  return Handelbars.compile(tmpl);
};
