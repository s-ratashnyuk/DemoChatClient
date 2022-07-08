import { Errors, ErrorTypes } from './errorGeneral';
import { Block } from '../../components/Core/Block/Block';
import './errors.less';

export function withError(errorType: ErrorTypes, description: string): typeof Block {
  return class extends Errors {
    constructor() {
      super({
        errorType,
        description,
      });
    }
  };
}
