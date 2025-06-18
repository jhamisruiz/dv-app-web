import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export enum BlockUIType {
  ERROR,
  LOADING,
  WARNING,
}
export interface BlockUIMessage {
  message: string;
  icon?: string;
  type?: BlockUIType;
}

const defaultLoaderMessage = 'Please wait';
const defaultLoaderType = BlockUIType.LOADING;
const defaultLoaderIcon = 'icon-spinner4 spinner';

@Injectable({
  providedIn: 'root',
})
export class BlockUIService {
  private loader$ = new BehaviorSubject<boolean>(false);

  private loaderMessage$ = new BehaviorSubject<BlockUIMessage>({
    message: defaultLoaderMessage,
    type: defaultLoaderType,
    icon: defaultLoaderIcon,
  });

  constructor() { }

  get loader(): Observable<boolean> {
    return this.loader$.asObservable();
  }

  get messages(): Observable<BlockUIMessage> {
    return this.loaderMessage$.asObservable();
  }

  setMessage(message: string, type?: BlockUIType, icon?: string): void {
    type = undefined === type ? BlockUIType.LOADING : type;
    icon = icon || (BlockUIType.ERROR === type ? 'icon-cancel-circle2' : (BlockUIType.WARNING === type ? 'icon-warning' : 'icon-spinner4 spinner'));
    this.loaderMessage$.next({ message, type, icon });
  }

  show(message?: string): void {
    if ('string' === typeof message) {
      this.setMessage(message);
    }
    this.loader$.next(!0);
  }

  hide(): void {
    this.loader$.next(!1);
    this.reset();
  }

  private reset(): void {
    this.loaderMessage$.next({
      message: defaultLoaderMessage,
      type: defaultLoaderType,
      icon: defaultLoaderIcon,
    });
  }

}
