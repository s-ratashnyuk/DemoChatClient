const path = require('path');
const fs = require('fs');
const Handlebars = require('handlebars');

const baseHandlebarTemplatePath = path.join(__dirname, '..', 'layout', 'base.hbs');
const baseHandlebarTemplate = fs.readFileSync(baseHandlebarTemplatePath);

// очень упрощенная реализация layout
// есть базовый лэйаут, baseHandlebarTemplate
// все остальные hbs страницы подставляются в него
// если в начале этих страниц есть блок "---", например
//
// ---
// param_1: value1
// param_2: value2
// ---
//
// то этот блок парсится и передается при компиляции базового лэйаута
// в качестве параметров: {param_1: value1, param_2: value2}
const preprocessHBS = (c, lc) => {
  try {
    const parsed = [...c.matchAll(/---((?:.|\n)*)---((?:.|\n)*)$/g)][0];
    let partial = '';
    let params = {};
    if (parsed === undefined) {
      partial = Handlebars.compile(c);
    } else {
      const page = parsed[2];
      params = parsed[1]
        .split('\n')
        .filter((a) => { return a !== ''; })
        .map((a) => { return a.split(':'); })
        .filter((a) => { return a.length > 1; })
        .reduce((a, v) => { const b = { ...a }; b[v[0]] = v[1].trim(); return b; }, {});
      partial = Handlebars.compile(page);
    }
    Handlebars.registerPartial('PageContent', partial);
    return Handlebars.compile(baseHandlebarTemplate.toString())(params);
  } catch (e) {
    lc.emitError(e);
    return c;
  }
};

module.exports = preprocessHBS;
