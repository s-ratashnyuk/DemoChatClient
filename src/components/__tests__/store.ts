import { Store } from '../store';

describe('core/Store', () => {
  it('should set value', () => {
    const store = new Store();
    store.set('userId', 24099);
    expect(store.getStore()).toEqual({ userId: 24099 });
  });

  it('should emit event', () => {
    const store = new Store();
    const mock = jest.fn();

    store.on('userId', mock);
    store.set('userId', 24099);

    expect(mock).toHaveBeenCalled();
    expect(mock).toBeCalledWith(24099);
  });

  it('should delete data after pop', () => {
    const store = new Store();
    store.set('a', 111);
    store.set('b', 222);
    store.set('c', 333);
    store.pop('b');
    expect(store.getStore()).toEqual({
      a: 111,
      c: 333,
    });
  });
});
