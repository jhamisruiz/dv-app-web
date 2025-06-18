import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadMenu } from '@store/app-menu/actions/app-menu.actions';
import { AppStateStore } from '@store/app.state';

@Injectable({
  providedIn: 'root',
})
export class MenuBroadcastService {

  private broadcastChannel!: BroadcastChannel;
  constructor(private store: Store<AppStateStore>) {
    this.broadcastChannel = new BroadcastChannel('my-channel');
    this.broadcastChannel.addEventListener('message', (event) => {
      //this.onMessage(event.data);
      if (event.data) {
        this.onUpdateMenu();
      }
    });
  }
  broadcastInit(): void { }
  updateMenuBroadcast(): void {
    this.broadcastChannel.postMessage('onUpdateMenu');
  }

  onUpdateMenu(): void {
    this.store.dispatch(loadMenu());
  }

  // onMessage(data: any): void {
  //   // Aquí puedes manejar los mensajes recibidos del canal
  //   console.log('Received BroadcastService message:', data);
  // }

  // broadcast(data: any): void {
  //   this.broadcastChannel.postMessage(data);
  // }

}
