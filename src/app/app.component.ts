import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuBroadcastService } from '@services/broadcast-services/menu-broadcast.service';

import { environment } from 'src/environments/environment';
import { DomainService } from '@services/app-services/app.domain.service';
import { LocalStoreService } from '@services/local-store.service';
import { UserService } from '@services/user.service';

const domainService = new DomainService(new LocalStoreService());
const domainPath = domainService.getDomain();

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MenuBroadcastService, UserService],
})
export class AppComponent  {
  title = 'dv-app-web';

  constructor(private broadcastService: MenuBroadcastService, private userService: UserService, private router: Router) {
    this.broadcastService.broadcastInit();
    document.documentElement.setAttribute('data-layout', environment.dataLayout);
    document.documentElement.setAttribute('data-layout-mode', environment.dataLayoutMode);
    console.log('AppComponent constructor: ', domainPath, this.router.url);
    if (domainPath) {
      this.userService.resetRouterConfig(domainPath);
    }
  }

}
