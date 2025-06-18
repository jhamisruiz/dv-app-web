/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { PermissionService } from '@app/shared/services/permission.service';
import { UserService } from '@app/shared/services/user.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModuleGuard implements CanActivate {
  constructor(
    private user: UserService,
    private pSv: PermissionService,
    private router: Router,
  ) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return new Observable<boolean | UrlTree>((observer) => {
      this.pSv.getModulos().subscribe((m) => {

        if (this.user.isAuthenticated) {
          if (route?.data['home'] !== 'home') {
            if (m?.length) {
              if ((m.some(m => m.url === route?.routeConfig?.path))) {
                console.log();
                observer.next(true);
              } else {
                this.router.navigate(['/']);
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

}
