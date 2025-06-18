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

  // Cookies

  // private escapeRegExp(e: string) {
  //   return e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
  // }

  // private setCookie(key: string | { [key: string]: any }, value?: any): void {
  //   const data = 'string' === typeof key ? { [key]: value } : key;
  //   for (let keys = ObjectKeys(data), i = 0, len = keys.length; i < len; i++) {
  //     document.cookie = encodeURIComponent(this.keyPrefix + keys[i]) + '=' + encodeURIComponent(JSON.stringify(data[keys[i]]));
  //   }
  // }

  // private getCookie(key: string | string[]): any {
  //   const cookies = ';' + document.cookie + ';';
  //   const data = {};
  //   for (let keys = isArray(key) ? key : [key], i = 0, len = keys.length, k = void 0, s = void 0, d = void 0; i < len; i++) {
  //     k = this.escapeRegExp(encodeURIComponent(this.keyPrefix + keys[i]));
  //     s = new RegExp(';\\s*' + k + '\\s*=\\s*([^;]+)\\s*;');
  //     d = cookies.match(s);
  //     data[keys[i]] = d ? JSON.parse(decodeURIComponent(d[1])) : null;
  //   }
  //   return isArray(key) ? data : data[key];
  // }

  // private removeCookie(key: string | string[], usePrefix = true) {
  //   const o = isArray(key) ? key : [key];
  //   for (let r = 0, s = o.length; r < s; r++) {
  //     document.cookie = this.escapeRegExp(encodeURIComponent((usePrefix ? this.keyPrefix : '') + o[r])) + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  //   }
  // }


  private md5(str: string): string {
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
