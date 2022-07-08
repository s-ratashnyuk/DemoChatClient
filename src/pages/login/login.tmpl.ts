import Handelbars from 'handlebars';
import { registerComponentPlaceholder } from '../../components/Core/RegisterPartials';

const tmpl = `
<div id="container">
    <div class="login-main-window">
        <div class="header">
            <h1>{{ header }}</h1>
        </div>
        <div class="form">
            {{InputComponent 'inputLogin'}}
            {{InputComponent 'inputPassword'}}
        </div>
        <div class="error">
            <span><!-- insert error here --></span>
        </div>
        <div class="buttons">
            {{ButtonComponent 'buttonLogin'}}
            {{ButtonComponent 'buttonSignup'}}
        </div>
    </div>
</div>
`;

export const loginTmpl = (): string => {
  registerComponentPlaceholder('ButtonComponent');
  registerComponentPlaceholder('InputComponent');
  return Handelbars.compile(tmpl)({ header: 'Login' });
};
