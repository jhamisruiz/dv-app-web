import { Component, OnInit } from '@angular/core';
import { AppStateStore } from '../store/app.state';
import { Store } from '@ngrx/store';
import { selectLoadingCompForm } from '../store/app/selectors/app.selectors';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AppConfigService } from '@app/shared/services/config.service';
import { selectListMenu } from '@store/app-menu/selectors/app-menu.selectors';

@Component({
  selector: 'app-views',
  templateUrl: './views.component.html',
  styleUrls: ['./views.component.scss'],
})
export class ViewsComponent implements OnInit {

  url: any;
  menuSider: any[] = [];
  updateComponent = true;

  viewMode = 'VIEW';

  componente: any;
  modulo: any;

  constructor(
    private store: Store<AppStateStore>,
    private router: Router,
    private sv: AppConfigService,
  ) {
    this.store.select(selectLoadingCompForm).subscribe((r) => {
      if (r?.formMode) {
        this.viewMode = r?.formMode;
        this.update();
      }
    });
  }

  ngOnInit(): void {
    if (1) { }
    const url = this.router.url;
    this.url = url.split('/');
    this.routerLink();
    this.store.select(selectListMenu).subscribe((r) => {
      this.menuSider = r ?? [];
      this.getRouterName(this.url);
    });
  }

  routerLink(): any {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.url = e.url.split('/');
        this.getRouterName(this.url);
      });
  }
  update(): void {
    this.updateComponent = false;
    // Promise.resolve().then(() => this.updateComponent = true);
    this.sv.getUpdate().subscribe((r) => {
      this.updateComponent = r;
    });
  }

  getRouterName(url: any): void {
    this.componente=null;
    this.modulo=null;
    this.menuSider.forEach((v) => {
      if (v.url === url[2]) {
        this.modulo = { url: v.url, name: v.nombre };
        if (v.componentes) {
          const component: any[] = v.componentes;
          component.forEach((c) => {
            if (c.url === url[3]) {
              this.componente = { url: c.url, name: c.nombre };
            }
          });
        }
      }
    });
  }
}
