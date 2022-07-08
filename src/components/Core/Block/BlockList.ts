import { Block } from './Block';
import { elementsPlacer } from '../ElementsPlacer';

export class BlockList extends Block {
  private blockElements: Record<string, Block>;

  render(): string | null {
    this.blockElements = {};
    const res = [];
    if (this.props.items === undefined) {
      return '';
    }
    for (const [, el] of Object.entries(this.props.items)) {
      const tmp = document.createElement('div');
      const rnd = Math.floor(Math.random() * 1000);
      const key = `tmp-${rnd}`;
      tmp.classList.add(key);
      this.blockElements[key] = el as Block;
      res.push(tmp.outerHTML);
    }
    return res.join('\n');
  }

  componentDidRender() {
    if (this.props.pleaseScroll) {
      this.getContent().scrollTo(0, this.getContent().scrollHeight);
    }
    if (this.element !== null && this.blockElements !== undefined) {
      elementsPlacer(this.element, this.blockElements);
    }
  }

  clear() {
    this.setProps({ items: {} });
  }
}
