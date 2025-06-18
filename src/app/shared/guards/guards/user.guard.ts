/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { APP_PHAT_COMPONENT } from '@app/shared/common/constants';
import { PermissionService } from '@app/shared/services/permission.service';
import { UserService } from '@app/shared/services/user.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserGuard implements CanActivate {
  constructor(
    private user: UserService,
    private pSv: PermissionService,
    private router: Router,
  ) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const urls: string[] = this.extractUrls(state.root);
    return new Observable<boolean | UrlTree>((observer) => {
      this.pSv.getModulos().subscribe((m) => {

        if (this.user.isAuthenticated) {
          if (m?.length) {
            const componentes = this.pSv.getComponentes(m, urls[APP_PHAT_COMPONENT]);
            if (componentes?.length) {
              if ((componentes.some(c => c.url === route?.routeConfig?.path))) {
                this.pSv.setComponentPermission(componentes, route?.routeConfig?.path ?? '');
                observer.next(true);
              } else {
                this.router.navigate(['/', urls[APP_PHAT_COMPONENT]]);
                observer.next(true);
              }
            }
          }
          observer.next(true);
        } else {
          this.router.navigate(['/', 'login']);
          observer.next(false);
        }
        observer.complete();
      });
    });

  }

  private extractUrls(snapshot: ActivatedRouteSnapshot): string[] {
    const urls: string[] = [];
    if (snapshot.routeConfig && snapshot.routeConfig.path) {
      urls.push(snapshot.routeConfig.path);
    }
    snapshot.children.forEach((child) => {
      const childUrls = this.extractUrls(child);
      urls.push(...childUrls);
    });
    return urls;
  }

}
