import Handelbars from 'handlebars';
import { registerComponentPlaceholder } from '../../components/Core/RegisterPartials';

const tmpl = `
<div class="profile-window">
    <div class="left-panel">
        {{ButtonComponent 'buttonBack'}}
    </div>
    <div class="right-panel">
        {{AvatarComponent 'avatar'}}
        <h1 class="right-panel-name">{{ displayName }}</h1>
        {{#if show_profile}}
        <div class="right-panel-form">
            <form>
                {{InputComponent 'inputEmail'}}
                {{InputComponent 'inputLogin'}}
                {{InputComponent 'inputFirstName'}}
                {{InputComponent 'inputSecondName'}}
                {{InputComponent 'inputDisplayName'}}
                {{InputComponent 'inputPhone'}}
            </form>
        </div>
        {{/if}}
        
        <div class="right-panel-password hide">
            {{InputComponent 'inputOldPassword'}}
            {{InputComponent 'inputNewPassword'}}
            {{InputComponent 'inputNewPasswordRepeate'}}
        </div>
       
        <div class="right-panel-action-base">
            <div class="right-panel-action-manage">
                {{ButtonComponent 'buttonProfileChange'}}
                {{ButtonComponent 'buttonPasswordChange'}}
                {{ButtonComponent 'buttonSignOut'}}
            </div>
            <div class="right-panel-action-save hide">
                {{ButtonComponent 'buttonSave'}}
                {{ButtonComponent 'buttonCancelSave'}}
            </div>
        </div>
        {{AvatarLoadComponent 'avatarLoad'}}
    </div>
</div>
`;

export const profileTmpl = () => {
  registerComponentPlaceholder('InputComponent');
  registerComponentPlaceholder('ButtonComponent');
  registerComponentPlaceholder('AvatarComponent');
  registerComponentPlaceholder('AvatarLoadComponent');
  return Handelbars.compile(tmpl);
};
