import Handelbars from 'handlebars';

const tmpl = `
  <img src="{{ avatarImg }}"/>
  <div class="right-panel-avatar-hover"><p>Change <span>avatar</span></p></div>
`;

export const avatarTmpl = () => {
  return Handelbars.compile(tmpl);
};
