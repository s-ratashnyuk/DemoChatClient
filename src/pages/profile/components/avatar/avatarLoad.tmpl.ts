import Handelbars from 'handlebars';
import { registerComponentPlaceholder } from '../../../../components/Core/RegisterPartials';

const tmpl = `
  <div class="right-panel-change-avatar-modal">
      <header>
          <h2>Upload file</h2>
          <h2 class="h2-error hide">Error: try again</h2>
      </header>
      <div class="avatar-modal-body">
          {{ButtonComponent 'buttonChooseFile'}}
          <span></span>
      </div>
      {{ButtonComponent 'buttonChangeAvatar'}}
      {{ButtonComponent 'buttonChangeAvatarClose'}}
      <footer>
          <span class="avatar-modal-error"><!--Error: haven't chosen file--></span>
      </footer>
  </div>
`;

export const avatarLoadTmpl = () => {
  registerComponentPlaceholder('ButtonComponent');
  return Handelbars.compile(tmpl);
};
