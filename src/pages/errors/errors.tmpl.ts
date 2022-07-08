import Handelbars from 'handlebars';

const tmpl = `
<div class="error-window" data-testid="{{ errorType }}">
    <h1>{{ title }}</h1>
    <h3>{{ description }}</h3>
    <a href="#" onClick="window.history.back();">Back</a>
</div>
`;

export const errorsTmpl = () => {
  return Handelbars.compile(tmpl);
};
