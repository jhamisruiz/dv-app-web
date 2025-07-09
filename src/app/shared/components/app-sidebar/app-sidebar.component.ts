import { NavigationEnd, Router } from '@angular/router';
import { AppConfigService } from './../../services/config.service';
import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';
import { filter } from 'rxjs';
import { loadCompAction } from '@app/store/app/actions/app.actions';
import { Store } from '@ngrx/store';
import { AppStateStore } from '@store/app.state';
import { selectListMenu, selectMenuLoading } from '@store/app-menu/selectors/app-menu.selectors';
import { loadMenu } from '@store/app-menu/actions/app-menu.actions';
import { environment } from 'src/environments/environment';
import { STOREKEY } from '@app/config/keys.config';
import { LocalStoreService } from '@services/local-store.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './app-sidebar.component.html',
  styleUrls: ['./app-sidebar.component.scss'],
})
export class AppSidebarComponent implements OnInit, AfterViewInit {

  sidebarVisible = false;
  layoutMode: string | null = 'dark';
  //
  menuSider: any[] = [];
  menuUrl = '';
  newURL = '';
  preloader = false;
  logo = 'assets/images/logo-dev.png';
  constructor(
    private sv: AppConfigService,
    private router: Router,
    private store: Store<AppStateStore>,
    private renderer: Renderer2,
    private persistence: LocalStoreService,
  ) { }

  ngOnInit(): void {
    const logo = this.persistence.get(STOREKEY.LOGO_EMPRESA);
    if (logo) {
      this.logo = '../assets/images/logo-sm.png';// environment.hostPublic + (logo).toString();
    }
    const url = this.router.url;
    const arr = url.split('/');
    this.menuUrl = arr[1];
    this.routerLink(arr[1]);
    this.preloader = true;
    this.store.select(selectMenuLoading).subscribe((r) => {
      this.preloader = r;
    },
      () => {
        this.preloader = false;
      });

    this.store.dispatch(loadMenu());

    this.store.select(selectListMenu).subscribe((r: any[]) => {
      this.menuSider = [...r].map( m => {
        let module: any = {};
        module = Object.assign({}, m);
        module.componentes = [...m.componentes].sort((c1: any, c2: any) => c1.orden - c2.orden);
        return module;
      }).sort((m1, m2) => m1.orden - m2.orden);
      this.sv.setComponents(r);
      //this.preloader = false;
    },
      () => {
        this.preloader = false;
      });
  }

  onDoubleClick(e: Event, r: string): void {
    this.router.navigate([r]);
    this.routerLink(r);
    const dl = document.documentElement.getAttribute('data-layout');
    if (dl !== 'horizontal') {
      this.onClick(e);
    }
  }

  onClick(e: Event): void {
    const dl = document.documentElement.getAttribute('data-layout');

    if (dl !== 'horizontal') {
      const el = e.target as HTMLElement;
      const ariaExpanded = el.getAttribute('aria-expanded');

      if (ariaExpanded !== null) {
        el.setAttribute('aria-expanded', (ariaExpanded === 'true' ? 'false' : 'true'));
        const next = el.nextElementSibling as HTMLElement;

        if (ariaExpanded === 'false') {
          this.renderer.addClass(next, 'show');
        } else {
          this.renderer.removeClass(next, 'show');
        }
      } else {
        const parent = el.parentElement;

        if (parent) {
          const parentAriaExpanded = parent.getAttribute('aria-expanded');

          if (parentAriaExpanded !== null) {
            parent.setAttribute('aria-expanded', (parentAriaExpanded === 'true' ? 'false' : 'true'));
            const next = parent.nextElementSibling as HTMLElement;

            if (parentAriaExpanded === 'false') {
              this.renderer.addClass(next, 'show');
            } else {
              this.renderer.removeClass(next, 'show');
            }
          }
        }
      }
    }
  }

  routerLink(murl: string): any {

    this.newURL = murl;
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        const arr = e.url.split('/');
        this.store.dispatch(loadCompAction({ formMode: 'VIEW', id: null }));
        if (arr[1] === murl) {
          this.menuUrl = murl;
        }
      });
  }

  dataSidebarSize(m: string): void {
    this.layoutMode = document.documentElement.getAttribute('data-sidebar-size');
    this.layoutMode = m;
    document.documentElement.setAttribute('data-sidebar-size', this.layoutMode);
    document.documentElement.setAttribute('data-layout', 'vertical');
  }
  dataLayoutStyle(m: string): void {
    document.documentElement.setAttribute('data-layout-style', m);
  }
  dataLayout(m: string): void {
    this.layoutMode = document.documentElement.getAttribute('data-layout');
    this.layoutMode = m;
    document.documentElement.setAttribute('data-layout', this.layoutMode);
    document.documentElement.setAttribute('data-sidebar-size', 'lg');
  }

  dataLayoutMode(m: string): void {
    this.layoutMode = document.documentElement.getAttribute('data-layout-mode');
    this.layoutMode = m;
    document.documentElement.setAttribute('data-layout-mode', this.layoutMode);
  }
  dataSidebar(m: string): void {
    document.documentElement.setAttribute('data-sidebar', m);
  }
  orderComponent(): any[] {
    return [];
  }

  ngAfterViewInit(): void {
    document.documentElement.setAttribute('data-layout', environment.dataLayout);
    document.documentElement.setAttribute('data-sidebar', 'dark');
    document.documentElement.setAttribute('data-topbar', 'dark');
  }
}
