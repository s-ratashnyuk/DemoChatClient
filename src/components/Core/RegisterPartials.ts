import Handelbars from 'handlebars';

export const registerComponentPlaceholder = (cmpName: string): void => {
  Handelbars.registerHelper(cmpName, (aStr) => {
    return new Handelbars.SafeString(`<div class="${aStr}"></div>`);
  });
};

export const buttonAsLink = (): void => {
  Handelbars.registerPartial('button_as_link', `
{{#if iserror}}
    <a class="button-as-link error" href="{{ href }}">{{ descr }}</a>
{{else}}
    <a class="button-as-link" href="{{ href }}">{{ descr }}</a>
{{/if}}  
  `);
};
