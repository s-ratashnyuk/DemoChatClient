import EventBus from './Core/EventBus/EventBus';

export class Store extends EventBus {
  private store: Record<string, unknown> = {};

  set(path: string, value: unknown) {
    this.store[path] = value;
    this.emit(path, value);
  }

  pop(path: string): unknown {
    const res = this.store[path];
    delete this.store[path];
    return res;
  }

  getStore(): Record<string, any> {
    return this.store;
  }
}

export const StoreGlobal = new Store();
