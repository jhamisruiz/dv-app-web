import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserService } from '../services/user.service';
import { TRANSACTION_HEADER } from '../common/constants';
import { STOREKEY } from '@app/config/keys.config';
import { LocalStoreService } from '@services/local-store.service';

declare const alertify: any;

@Injectable()
export class HttpConfig implements HttpInterceptor {

  constructor(
    private user: UserService,
    private persistence: LocalStoreService,
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any> | any> {
    let url = req.url;

    if (!(/^http.?:\/\//.test(url)) && !url.startsWith('.')) {
      // Normalize URL
      const remoteUrl = environment.apiHost;
      const endpoint = url.split(/\/+/).filter(f => String(f ?? '').trim().length > 0);
      const protocol = `http${environment.apiSSL ? 's' : ''}`;
      const version = environment.apiVersion;

      url = `${protocol}://${[remoteUrl, version, ...endpoint].join('/')}`;
      // url = `${protocol}://${[remoteUrl +version, ...endpoint].join('/')}`;
    }

    // Obtener el token de usuario.
    const authToken = this.user.userToken ?? '';
    const httpMethod = req.method;
    const cloneParams = req.params;
    const isTransaction = cloneParams.has('transactionId');
    const customHeaders: Record<string, string | string[]> = {};
    {
      authToken.length > 0 && (customHeaders['Authorization'] = `Bearer ${authToken}`);

      // COMPONENT_ID_HEADER
      if ('GET' !== httpMethod && isTransaction) {
        customHeaders[TRANSACTION_HEADER] = [...[cloneParams.get('transationId')]].join('');
        cloneParams.delete('transactionId');
      }
    }

    const httpReq = req.clone({
      url,
      setHeaders: customHeaders,
      params: cloneParams,
    });

    return next
      .handle(httpReq)
      .pipe(
        map(event => {
          // TODO: No actuar sobre respuesta de tipo ArrayBuffer | Blob
          // response instanceof ArrayBuffer || response instanceof Blob

          if (event instanceof HttpResponse) {
            if (undefined !== event.body?.error && event.body?.error === true) {
              throw event.body;
            }
            //this.showHttpNotifications(event.body, event.status, httpMethod);
            /**
             * @Data
             *  Usa '=== true' para una verificación explícita
             *  Retorna únicamente el campo 'data' del cuerpo de la respuesta
             */
            if (event.body?.success === true) {

              return event.clone({ body: event.body.data });
            }

            return event;
          }
          return event;
        }),
        catchError(err => {
          // TODO: Validar errores tipos Blob
          // if (err.error && err.error instanceof ArrayBuffer) {
          //   err.error = JSON.parse(String.fromCharCode.apply(null, new Uint8Array(err.error) as any));
          // }

          const customError: Record<string, any> = {
            ...err,
          };

          if (err instanceof HttpErrorResponse) {
            const errorMessage = 'string' === typeof err?.error ? err.error : (!window.navigator.onLine ? 'ERR_INTERNET_DISCONNECTED' : err.statusText);
            customError['code'] = err.status;
            customError['message'] = `#(${err.status}) ${errorMessage}`;
            if (err?.error) {
              customError['code'] = err.error?.statusCode;
              customError['message'] = err?.error?.message;
            }
          }
          this.handleError(err, customError);
          //customError['baseError']=err;
          return throwError(customError);//throwError(customError);
        }),
      );
  }

  private handleError(err: any, customError: any): void {

    console.log(`customError['message']`, customError['message']);
    alertify.dialog('alert').set('notifier', 'position', 'top-center');
    if (err.error?.statusCode === 202) {
      const htmlw = `${customError['code'] ? customError['message'] : ('(#' + err?.status + ') ') + (err?.error ? err?.error : 'Error al conectar con el servidor')}`;
      alertify.
        alert(`<h4 class="text-warning"></h4>`, htmlw).show();
    } else if (err.status === 0) {
      alertify.
        alert(`<h4 class="text-danger">Error</h4>`,
          `<h5 class="text-danger">${('(#' + err?.status + ') ') + (err?.message ?? 'Error al conectar con el servidor')}</h5>`).show();
    } else {
      const html = `<h5 class="text-danger">${('(#' + err?.status + ') ') +
        (err?.error?.message ? err?.error?.message : 'Error al conectar con el servidor')}</h5>
        <ul class="d-flex flex-column">${this.processData(err)}
        </ul>`;

      alertify.
        alert(`<h4 class="text-danger">Error</h4>`, html).show();
    }

    const exp = this.persistence.get(STOREKEY.USER_EXPIRE) ?? '0';
    if (this.user.fechaexpire > Number(exp) || err?.error === 'Token is expired / Forbidden authentication.') {
      this.user.clearUserSession();
    }
  }

  private processData(err: any): any {
    if (!(err?.error?.data?.errors)) return '';
    const data: any[] = err?.error?.data?.errors;
    let html = '';
    data.forEach((error, i) => {
      html = html + `<i>${i + 1}. ${error.messages[0]}</i>`;
    });
    return html;
  };

}
