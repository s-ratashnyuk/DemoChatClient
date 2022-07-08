import { Block } from '../../components/Core/Block/Block';
import { errorsTmpl } from './errors.tmpl';
import './errors.less';

export enum ErrorTypes {
  e400 = 'e400',
  e500 = 'e500',
}

const errorDefaults = {
  e400: {
    name: '404',
    description: 'Page can not be found',
  },
  e500: {
    name: '500',
    description: 'Server error',
  },
};

type ErrorProps = {
  errorType: ErrorTypes,
  description?: string,
};

export class Errors extends Block {
  constructor(props: ErrorProps) {
    super('div', { ...errorDefaults[props.errorType], ...props });
  }

  render(): string | null {
    return errorsTmpl()(this.props);
  }
}
