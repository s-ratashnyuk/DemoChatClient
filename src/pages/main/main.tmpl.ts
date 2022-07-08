import Handelbars from 'handlebars';

const mainTmpl = `
<h2>Pages</h2>
<ul>
    {{#each links}}
        {{> main_li link_url=this.link_url link_name=this.link_name }}
    {{/each}}
</ul>
{{ButtonComponent 'buttonCheckRequests'}}
<div class="requests-result"></div>
`;

export const mainPage = (): Function => {
  Handelbars.registerPartial('main_li', `
<li>
    <a href="{{ link_url }}"> {{ link_name }}</a>
</li>
  `);
  Handelbars.registerHelper('ButtonComponent', (aStr) => {
    return new Handelbars.SafeString(`<div id="${aStr}"></div>`);
  });
  return Handelbars.compile(mainTmpl);
};
