import Handelbars from 'handlebars';

const tmpl = `
<label for="{{ form_element_id }}">{{ form_element_name }}</label>
<input {{#if is_password}} type="password" {{/if}} {{#if is_readonly}} readonly {{/if}} id="{{ form_element_id }}" value="{{ value }}"/>
`;

export const InputTemplateProfile = (): Function => {
  return Handelbars.compile(tmpl);
};
