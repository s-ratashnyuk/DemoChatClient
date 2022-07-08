import Handelbars from 'handlebars';

const tmpl = `
    <input class="input-general" id="{{ form_element_id }}" {{#if is_readonly}} readonly {{/if}}
     value="{{ value }}" placeholder="{{ form_element_placeholder }}"/>
`;

export function InputTemplateOnlyInput(): Function {
  return Handelbars.compile(tmpl);
}
