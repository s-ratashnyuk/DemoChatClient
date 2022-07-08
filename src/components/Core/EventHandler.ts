import { EventBusGlobal } from './EventBus/EventBusGlobal';
import { InputBase } from '../Input/InputBase';

type ValidationResults = {
  result: boolean,
  values?: Record<string, string>
};

export const handleFormButtonClick = (iElements: Record<string, InputBase>): ValidationResults => {
  const values:Record<string, string> = {};
  let isValid = true;
  for (const el of Object.keys(iElements)) {
    values[el] = iElements[el].inputValue;
    if (!iElements[el].validate()) {
      isValid = false;
    }
  }
  if (!isValid) {
    return {
      result: false,
    };
  }
  return {
    result: true,
    values,
  };
};

const onBlur = (e: InputBase):void => {
  if (!e.validate()) {
    e.showAlert();
  } else {
    e.hideAlert();
  }
};

const onFocus = (e: InputBase):void => {
  e.hideAlert();
};

export const registerHandlers = ():void => {
  EventBusGlobal.on('input:blur', onBlur);
  EventBusGlobal.on('input:focus', onFocus);
};
