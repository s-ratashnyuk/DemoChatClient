import { Block } from '../Block/Block';

export class Route {
  private readonly block: typeof Block;

  private blockObject: Block | null;

  private readonly rootElement: string;

  private readonly _element: HTMLElement | null;

  public readonly pathname: string;

  constructor(view: typeof Block, pathname: string, rootElement: string) {
    this.block = view;
    this.pathname = pathname;
    this.rootElement = rootElement;
    this._element = document.getElementById(this.rootElement);
  }

  navigate() {
    this.render();
  }

  leave() {
    if (this.block) {
      if (this._element === null) {
        throw Error('Root element must be present in DOM tree');
      }
      this._element.innerHTML = '';
      if (this.blockObject !== null) {
        this.blockObject.componentWillRemove();
        this.blockObject = null;
      }
    }
  }

  render() {
    if (this._element === null) {
      throw Error('Root element must be present in DOM tree');
    }
    this.blockObject = new this.block(); // eslint-disable-line
    document.title = this.blockObject.props.name;
    this._element.appendChild(this.blockObject.getContent());
  }
}
