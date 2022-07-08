import EventBus from './EventBus';

class EventBusGlobalImpl extends EventBus {
  private static instance: EventBusGlobalImpl;

  constructor() {
    if (EventBusGlobalImpl.instance) {
      // делаю тут именно то, на что ругается линтер -
      // возвращаю значение в конструкторе. Чтобы реализовать паттерн "синглтон"
      return EventBusGlobalImpl.instance; // eslint-disable-line
    }
    super();
    EventBusGlobalImpl.instance = this;
  }
}

export const EventBusGlobal = new EventBusGlobalImpl();
