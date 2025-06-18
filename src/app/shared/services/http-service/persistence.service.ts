import { isDevMode } from '@angular/core';
import { Md5 } from 'ts-md5';

export class PersistenceApiClass {
  debugMode = isDevMode();
  keyHashed = !this.debugMode;

  constructor(private api: Storage) { }

  set(key: string | { [key: string]: unknown }, value: unknown): void {
    const data = 'string' === typeof key ? { [key]: value } : key;
    for (const k of Object.keys(data)) {
      if (null !== data[k] && undefined !== data[k]) {
        this.api.setItem(this.generateKey(k), JSON.stringify(data[k]));
      }
    }
  }

  get<T = any>(key: string | string[]): T {
    const data = ([] as string[]).concat(key).reduce((a, k) => {
      const v = JSON.parse(this.api.getItem(this.generateKey(k)) ?? 'null');
      return { ...a, [k]: v };
    }, {} as { [key: string]: any });

    return Array.isArray(key) ? data : data[key];
  }

  has(key: string): boolean {
    const value = this.get(key);
    return null !== value && undefined !== value;
  }

  remove(key: string | string[]): void {
    for (const k of ([] as string[]).concat(key)) {
      this.api.removeItem(this.generateKey(k));
    }
  }

  clear(): void {
    this.api.clear();
  }

  private md5(str: string): string {
    //return new Md5().appendStr(str).end().toString();
    let key: any = '';
    if (str !== undefined) {
      key = new Md5().appendStr(str)?.end()?.toString();
    }
    return key;
  }

  private generateKey(key: string): string {
    return !this.keyHashed ? key : this.md5(key);
  }

}
