import Handelbars from 'handlebars';
import { registerComponentPlaceholder } from '../../../../components/Core/RegisterPartials';

const tmpl = `
<div class="input-pop-up-cont">
  <div class="chat-input-popup">
      {{InputComponent 'inputPopUpText'}}
      <div class="chat-input-popup-buttons">
        {{ButtonComponent 'buttonInputPopUpOK'}}
        {{ButtonComponent 'buttonInputPopUpClose'}}
      </div>
  </div>
</div>
`;

export function inputPopUpTmpl(): Function {
  registerComponentPlaceholder('InputComponent');
  registerComponentPlaceholder('ButtonComponent');
  return Handelbars.compile(tmpl);
}
