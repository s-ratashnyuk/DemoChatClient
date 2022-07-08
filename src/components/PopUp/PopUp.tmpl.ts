import Handelbars from 'handlebars';
import { registerComponentPlaceholder } from '../Core/RegisterPartials';

const tmpl = `
<div class="popup" data-testid="errorPopup">
  <div class="popup-header" data-testid="popupHeader">{{ header }}</div>
  <div class="popup-body">{{ body }}</div>
  {{ButtonComponent 'buttonClosePopup'}}
</div>
`;

export function PopUpTmpl(): Function {
  registerComponentPlaceholder('ButtonComponent');
  return Handelbars.compile(tmpl);
}
