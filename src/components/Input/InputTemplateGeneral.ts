import Handelbars from 'handlebars';

const tmpl = `
<label class="label-general" for="{{ form_element_id }}">{{ form_element_name }}</label>
<input class="input-general" {{#if is_password}} type="password" {{/if}} {{#if is_readonly}} readonly {{/if}} id="{{ form_element_id }}"
 value="{{ value }}" placeholder="{{ form_element_placeholder }}"/>
<span class="input-error" data-testid="{{ form_element_id }}-alert"></span>
`;

export function InputTemplateGeneral(): Function {
  return Handelbars.compile(tmpl);
}
