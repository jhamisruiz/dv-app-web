import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LOGIN_API_PATH } from '../common/constants';
import { includes } from 'lodash-es';
import { AppService } from '../services/app-services/app.service';
import { Router } from '@angular/router';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private app: AppService, private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(tap((event: HttpEvent<any>) => {

      if (event instanceof HttpResponse) {
        //FIXME:
        //(event && includes(event.url, LOGOUT_API_PATH) && event.body && !event.body.error)
        if (event && includes(event.url, LOGIN_API_PATH) && event.body && event.body?.id) {
          //NOTE: datos del usuario para crear session
          const data = event.body;

          //FIXME: fixear TOKEN, FECHA DE EXPIRACION y mas datos
          //8888
          //data.token = event.body?.id;
          data.login_expire = this.fechaexpire();
          // Verificar si el login es válido.
          if (data && data.token) {
            this.app.user.createSession(data);

            // this.app.user.loadStoredProperties();

            // // Cargar configuración inicial del usuario.
            // this.app.loadInitialSettings();

            this.router.navigate(['/', 'panel']);
          }
        }
      }
      return event;
    }));
  }

  fechaexpire(): number {
    const fechaActual = new Date();
    // Sumar un día a la fecha actual
    const fechaSumada = new Date(fechaActual.getTime() + 24 * 60 * 60 * 1000);
    // Obtener el día, mes y año de la fecha sumada
    const dia = fechaSumada.getDate() + 15;
    const mes = fechaSumada.getMonth() + 1; // Los meses en JavaScript empiezan en 0 (enero) y terminan en 11 (diciembre)
    const anio = fechaSumada.getFullYear();
    const f = `${dia}/${mes}/${anio}`;

    const d: any[] = f.split('/');
    const newDate = new Date(d[2], d[1] - 1, d[0]);
    return newDate.getTime();
  }
}
