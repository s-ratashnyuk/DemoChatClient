import { Block } from '../Core/Block/Block';
import { Button, ButtonTypes } from '../Button/Button';
import { PopUpTmpl } from './PopUp.tmpl';
import { elementsPlacer } from '../Core/ElementsPlacer';
import { EventBusGlobal } from '../Core/EventBus/EventBusGlobal';
import '../../styles/popup.less';

export type PopUpProps = {
  header: string,
  body: string,
  canNotClose?: boolean,
};

class PopUp extends Block {
  private readonly buttonClosePopup: Button;

  constructor() {
    super('div');
    this.buttonClosePopup = new Button({
      button_id: 'buttonClosePopup',
      button_name: 'Close',
      button_type: ButtonTypes.AZUL,
    });
    this.getContent().classList.remove('general-block-class');
    this.getContent().classList.add('popup-window');
    this.componentDidMount();
    this.hidePopup();
  }

  placeInDom() {
    if (this.element !== null) {
      document.body.appendChild(this.element);
    }
  }

  componentDidMount() {
    super.componentDidMount();
    const handleClosePopUpClick = (e: Button):void => {
      if (e.props.button_id === 'buttonClosePopup') {
        if (!this.props.canNotClose) {
          this.hidePopup();
        }
      }
    };
    this.addHandler(EventBusGlobal, 'button:click', handleClosePopUpClick);
  }

  showPopup(props: PopUpProps) {
    this.setProps(props);
    if (document.querySelector('.popup') === null) {
      this.placeInDom();
    }
    this.getContent().classList.remove('popup-hidden');
  }

  hidePopup() {
    this.getContent().classList.add('popup-hidden');
  }

  render(): string {
    return PopUpTmpl()(this.props);
  }

  componentDidRender() {
    super.componentDidRender();
    if (this.element !== null && this.buttonClosePopup !== undefined) {
      elementsPlacer(this.element, { buttonClosePopup: this.buttonClosePopup });
    }
  }
}

export default new PopUp();
