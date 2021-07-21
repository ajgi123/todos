class LocalStorageService {
  setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify({ value }));
  }

  getItem<T>(key: string): T | null;
  getItem<T>(key: string, otherwise: T): T;
  getItem<T>(key: string, otherwise?: T): T | null {
    const data: string | null = localStorage.getItem(key);
    if (data !== null) {
      return JSON.parse(data).value;
    }

    if (otherwise) {
      return otherwise;
    }

    return null;
  }
}

export const localStorageService = new LocalStorageService();
