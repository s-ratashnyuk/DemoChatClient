import Handelbars from 'handlebars';

const tmplGeneral = `
<button 
    type="button" 
    {{#if data_test_id}}data-testid="{{data_test_id}}"{{/if}} 
    class="{{ button_type }}">
        {{ button_name }}
</button>
`;

const tmplAsLink = `
<button 
    type="button" 
    {{#if data_test_id}}data-testid="{{data_test_id}}"{{/if}} 
    class="button-as-link {{#if show_as_error}}button-as-link-error{{/if}}">
        {{ button_name }}
</button>
`;

export function ButtonTemplateGeneral(): Function {
  return Handelbars.compile(tmplGeneral);
}

export function ButtonTemplateLink(): Function {
  return Handelbars.compile(tmplAsLink);
}
