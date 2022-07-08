import Handelbars from 'handlebars';
import { Block } from '../../../../components/Core/Block/Block';
import { EventBusGlobal } from '../../../../components/Core/EventBus/EventBusGlobal';

const tmplLi = `            
            <li class="chat-popup-menu-item" id="{{id}}">
                <div class="{{menuItemType}}"></div>
                <span>{{name}}</span>
            </li>`;

export enum MenuPopupItemTypes {
  ADD = 'sign plus-sign',
  DELETE = 'sign remove-sign',
}

type MenuItem = {
  name: string,
  menuItemType: MenuPopupItemTypes,
};

type MenuPopupProps = {
  items: Record<string, MenuItem>
};

export class MenuPopup extends Block {
  constructor(props: MenuPopupProps) {
    super('div', props);
    this.hide();
    this.getContent().classList.add('chat-popup');
  }

  show(top?: string, left?: string) {
    if (top !== undefined && left !== undefined) {
      const el = this.getContent();
      el.style.top = top;
      el.style.left = left;
      document.body.appendChild(el);
      super.show();
      document.addEventListener('click', this.handleMissclick.bind(this), { capture: true });
    } else {
      throw Error('Have to know x and y');
    }
  }

  hide() {
    document.removeEventListener('click', this.handleMissclick);
    super.hide();
  }

  render(): string | null {
    const tmp = document.createElement('div');
    const ul = document.createElement('ul');
    ul.classList.add('chat-popup-menu');
    for (const el of Object.keys(this.props.items)) {
      const elProps = this.props.items[el];
      const liTxt = Handelbars.compile(tmplLi)({ ...elProps, id: el });
      ul.appendChild(new DOMParser().parseFromString(liTxt, 'text/html').body);
    }
    tmp.appendChild(ul);
    return tmp.innerHTML;
  }

  handleMissclick() {
    this.hide();
  }

  componentDidRender() {
    for (const el of this.getContent().getElementsByTagName('li')) {
      el.onclick = () => {
        EventBusGlobal.emit('popup:click', el.id);
      };
    }
  }
}
