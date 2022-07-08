import { Route } from './Route';
import { Block } from '../Block/Block';
import { EventBusGlobal } from '../EventBus/EventBusGlobal';
import { isLoggedIn } from '../../../utils/authCookies';
import { AddressHash } from '../AddressHash';

type RouterProps = {
  rootQuery: string,
  redirects?: Record<string, string>,
  page400?: typeof Block,
  page500?: typeof Block
};

export class Router {
  private static __instance: Router | undefined = undefined;

  private readonly routes: Record<string, Route>;

  private readonly rootQuery: string;

  private readonly page400: typeof Block;

  private readonly page500: typeof Block;

  private readonly redirects: Record<string, string>;

  private history: History;

  private currentRoute: Route;

  private handlePopState;

  constructor(props: RouterProps) {
    if (Router.__instance !== undefined) {
      // делаю именно то, на что ругается линтер
      return Router.__instance; // eslint-disable-line
    }
    this.routes = {};
    this.history = window.history;
    this.rootQuery = props.rootQuery;
    this.redirects = props.redirects !== undefined ? props.redirects : {};
    this.handlePopState = this.handlePopStateImpl.bind(this);

    if (props.page400) {
      this.use('/400', props.page400);
    }
    if (props.page500) {
      this.use('/500', props.page500);
    }
    Router.__instance = this;
  }

  use(pathname: string, block: typeof Block) {
    this.routes[pathname] = new Route(block, pathname, this.rootQuery);
    return this;
  }

  handlePopStateImpl(e: PopStateEvent) {
    if (e.state) {
      AddressHash.parseAddress();
      this.onRoute(e.state);
    }
  }

  start(pathname = '/') {
    EventBusGlobal.on('route', (startPathname: string) => {
      this.go(startPathname);
    });
    window.addEventListener('popstate', this.handlePopState);
    this.go(pathname);
  }

  onRoute(pathname: string) {
    if (pathname in this.redirects) {
      document.location.pathname = this.redirects[pathname];
      return;
    }
    if ((pathname !== '/' && pathname !== '/sign-up') && !isLoggedIn()) {
      this.go('/');
      return;
    }
    const route = this.getRoute(pathname);
    if (this.currentRoute) {
      this.currentRoute.leave();
    }
    this.currentRoute = route;
    route.navigate();
  }

  show500() {
    if (this.page500 !== null) {
      this.go('/500');
    } else {
      throw Error('Error 500');
    }
  }

  go(pathname: string) {
    if (this.currentRoute && this.currentRoute.pathname !== pathname) {
      this.history.pushState(pathname, '', pathname);
    }
    this.onRoute(pathname);
  }

  back() {
    this.history.back();
  }

  forward() {
    this.history.forward();
  }

  getRoute(pathname: string): Route {
    if (pathname in this.routes) {
      return this.routes[pathname];
    }
    if (this.page400 !== null) {
      return this.routes['/400'];
    }
    throw Error('Can not find route');
  }

  reset() {
    window.removeEventListener('popstate', this.handlePopState);
    Router.__instance = undefined;
  }
}
