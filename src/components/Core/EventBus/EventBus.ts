import { cl } from '../../../utils/debugLog';

export default class EventBus {
  private readonly listeners: Record<string, object[]> = {};

  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string, callback: Function) {
    if (!this.listeners[event]) {
      throw new Error(`Нет события: ${event}`);
    }
    this.listeners[event] = this.listeners[event].filter(
      (listener) => { return listener !== callback; },
    );
  }

  emit(event: string, ...args: any) {
    if (!this.listeners[event]) {
      cl(`EventBus: Нет события: ${event}`);
      return;
    }
    this.listeners[event].forEach((listener: Function) => {
      listener(...args);
    });
  }
}
