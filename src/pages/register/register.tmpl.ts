import Handelbars from 'handlebars';
import { registerComponentPlaceholder } from '../../components/Core/RegisterPartials';

const tmpl = `
<div id="container">
    <div class="register-main-window">
        <div class="header">
            <h1>{{ header }}</h1>
        </div>
        <div class="register">
            {{InputComponent 'inputEmail'}}
            {{InputComponent 'inputLogin'}}
            {{InputComponent 'inputFirstName'}}
            {{InputComponent 'inputSecondName'}}
            {{InputComponent 'inputPhone'}}
            {{InputComponent 'inputPassword'}}
            {{InputComponent 'inputPasswordRepeat'}}
            <span><!--Here is the place for error like: Passwords are not the same--></span>
        </div>
        <div class="buttons">
            {{ButtonComponent 'buttonRegister'}}
            {{ButtonComponent 'buttonSignin'}}
        </div>
    </div>
</div>
`;

export const registerTmpl = (): string => {
  registerComponentPlaceholder('ButtonComponent');
  registerComponentPlaceholder('InputComponent');
  return Handelbars.compile(tmpl)({ header: 'Register' });
};
