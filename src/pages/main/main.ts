import { Router } from '../../components/Core/Router/Router';
import { registerHandlers } from '../../components/Core/EventHandler';
import { Login } from '../login/login';
import { Register } from '../register/register';
import { Profile } from '../profile/profile';
import { withError } from '../errors/errors';
import { ErrorTypes } from '../errors/errorGeneral';
import { withBlockAsPage } from '../../components/Core/Block/BlockAsPage';
import { Chat } from '../chat/chat';
import '../../styles/base.less';

export function init() {
  registerHandlers();

  document.addEventListener('DOMContentLoaded', () => {
    const router = new Router({
      rootQuery: 'app',
      page400: withError(ErrorTypes.e400, 'Can not find page'),
      page500: withError(ErrorTypes.e500, 'Server error'),
    });
    router.use('/', withBlockAsPage(Login));
    router.use('/sign-up', withBlockAsPage(Register));
    router.use('/settings', withBlockAsPage(Profile));
    router.use('/messages', withBlockAsPage(Chat));
    router.start(window.location.pathname);
  });
}
