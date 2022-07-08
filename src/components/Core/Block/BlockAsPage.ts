import { elementsPlacer } from '../ElementsPlacer';
import { Block } from './Block';

export function withBlockAsPage(wrappedBlock: typeof Block): typeof wrappedBlock {
  return class extends wrappedBlock {
    private childElements: Record<string, Block>;

    _componentDidRender() {
      super._componentDidRender();
      // не знаю, как это перенести в конструктор :-(
      this.childElements = this.props.childElements;
      if (this.element !== null && this.childElements !== undefined) {
        elementsPlacer(this.element, this.childElements);
      }
    }

    componentWillRemove() {
      super.componentWillRemove();
      if (this.childElements !== undefined) {
        for (const [, el] of Object.entries(this.childElements)) {
          el.componentWillRemove();
        }
      }
    }

    hide() {
      this.getContent().classList.add('hide');
    }

    show() {
      this.getContent().classList.remove('hide');
    }
  };
}
