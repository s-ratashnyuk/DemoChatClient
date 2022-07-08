import { avatarTmpl } from './avatar.tmpl';
import { Block } from '../../../../components/Core/Block/Block';
import { EventBusGlobal } from '../../../../components/Core/EventBus/EventBusGlobal';

export class ProfileAvatar extends Block {
  constructor() {
    super('div');
    this.props.avatarImg = '../../../static/icons/avatar-big-placeholder.svg';
    this.getContent().classList.remove('general-block-class');
    this.getContent().classList.add('right-panel-avatar');
  }

  render(): string | null {
    return avatarTmpl()(this.props);
  }

  get avatarButton() {
    return this.getContent().getElementsByClassName('right-panel-avatar-hover')[0];
  }

  handleAvatarClick() {
    EventBusGlobal.emit('updateAvatar:click');
  }

  componentDidRender() {
    this.avatarButton.addEventListener('click', this.handleAvatarClick);
  }

  componentWillRemove() {
    super.componentWillRemove();
    this.avatarButton.removeEventListener('click', this.handleAvatarClick);
  }
}
