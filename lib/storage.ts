import localforage from 'localforage';

class Storage {
  private store: LocalForage;

  constructor() {
    this.store = localforage.createInstance({
      name: 'MP_TODO',
      storeName: 'todos',
    });
  }

  async get<T = any>(key: string, def?: T) {
    return (await this.store.getItem<T>(key)) ?? (def as T);
  }

  async set(key: string, value: any) {
    return await this.store.setItem(key, JSON.parse(JSON.stringify(value)));
  }

  async remove(key: string) {
    return await this.store.removeItem(key);
  }

  async clear() {
    return await this.store.clear();
  }

  async length() {
    return await this.store.length();
  }
}

const storage = new Storage();
export default storage;
