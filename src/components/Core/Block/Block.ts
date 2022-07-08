import EventBus from '../EventBus/EventBus';

enum BlockEvents {
  INIT = 'init',
  FLOW_CDM = 'flow:component-did-mount',
  FLOW_RENDER = 'flow:render',
  FLOW_CDU = 'flow:component-did-update',
  FLOW_ARENDER = 'flow:after-render',
}

export type Props = Record<any, any>;

type Callbacks = {
  eventBus: EventBus,
  event: string,
  callback: Function
};

export class Block {
  private _element: HTMLElement | null = null;

  private readonly _tagName: string;

  props: Props;

  private eventBus: () => EventBus;

  private _updatedProps: string[] = [];

  private callbacks: Array<Callbacks> = [];

  constructor(tagName: string = 'div', props = {}) {
    const eventBus = new EventBus();
    this._tagName = tagName;
    this.props = this._makePropsProxy(props);

    this.eventBus = () => { return eventBus; };

    this._registerEvents(eventBus);
    eventBus.emit(BlockEvents.INIT);
  }

  _registerEvents(eventBus: EventBus) {
    eventBus.on(BlockEvents.INIT, this.init.bind(this));
    eventBus.on(BlockEvents.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(BlockEvents.FLOW_RENDER, this._render.bind(this));
    eventBus.on(BlockEvents.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(BlockEvents.FLOW_ARENDER, this._componentDidRender.bind(this));
  }

  _componentDidRender() {
    this.componentDidRender();
  }

  // to overload
  componentDidRender() {

  }

  _createResources() {
    this._element = Block._createDocumentElement(this._tagName);
  }

  init() {
    this._createResources();
    this.eventBus().emit(BlockEvents.FLOW_RENDER);
  }

  _componentDidMount() {
    this.eventBus().emit(BlockEvents.FLOW_CDU, this.props, this.props);
    this.componentDidMount();
  }

  // Может переопределять пользователь, необязательно трогать
  componentDidMount() {
  }

  dispatchComponentDidMount() {
    this.eventBus().emit(BlockEvents.FLOW_CDM);
  }

  _componentDidUpdate() {
    const response = this.componentDidUpdate();
    if (response) {
      this.eventBus().emit(BlockEvents.FLOW_RENDER);
    }
  }

  componentDidUpdate() {
    return this._updatedProps.length > 0;
  }

  componentWillRemove() {
    for (const a of this.callbacks) {
      a.eventBus.off(a.event, a.callback);
    }
  }

  setProps = (nextProps: Props) => {
    if (!nextProps) {
      return;
    }
    this._updatedProps = [];
    const oldProps = {};
    Object.assign(oldProps, this.props);
    Object.assign(this.props, nextProps);
    this.eventBus().emit(BlockEvents.FLOW_CDU, oldProps, nextProps);
  };

  get element() {
    return this._element;
  }

  _render() {
    const block = this.render();
    if (this._element !== null && block !== null) {
      this._element.innerHTML = block;
    }
    this.eventBus().emit(BlockEvents.FLOW_ARENDER);
  }

  // Может переопределять пользователь, необязательно трогать
  render(): string | null {
    return null;
  }

  // чтобы при удалении компонента удалять его подписки на события
  addHandler(eventBus: EventBus, event: string, callback: Function) {
    this.callbacks.push({
      eventBus,
      event,
      callback,
    });
    eventBus.on(event, callback);
  }

  getContent(): HTMLElement {
    if (this.element !== null) {
      return this.element;
    }
    throw Error('Something wrong: can not return HTMLElement');
  }

  _makePropsProxy(props: Props) {
    const self = this;
    return new Proxy(props, {
      set(target: Props, prop: string, value: any) {
        if (value !== target[prop]) {
          // я хочу сделать именно то, на что ругается линтер - переприсвоить значение
          // переменной, которая является аргументом функции
          target[prop] = value; // eslint-disable-line
          self._updatedProps.push(prop);
        }
        return true;
      },
      deleteProperty() {
        throw Error('Access denied');
      },
    });
  }

  static _createDocumentElement(tagName: string) {
    const element = document.createElement(tagName);
    element.classList.add('general-block-class');
    return element;
  }

  show() {
    const e = this.getContent();
    e.classList.remove('hide');
  }

  hide() {
    const e = this.getContent();
    e.classList.add('hide');
  }
}
