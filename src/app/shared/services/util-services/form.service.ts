/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { PARAM_ID } from '@app/shared/common/constants';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Md5 } from 'ts-md5';
import { v4 } from 'uuid';

//import { LocalStoreService } from '../local-store.service';
import { STOREKEY } from '@app/config/keys.config';

export const enum FormRequest {
  CREATED,
  DELETED,
  UPDATED,
  PATCHED,
  ENABLED,
  DISABLED,
  LOADING,
  DONE,
  ERROR,
  FETCH_LOADING,
  FETCH_DONE,
  FETCH_ERROR,
}

export enum HttpMethods {
  GET,
  POST,
  PUT,
  PATCH,
  DELETE,
  OPTIONS,
}

const FormStatusFromMethod: Record<number, FormRequest> = {
  [HttpMethods.POST]: FormRequest.CREATED,
  [HttpMethods.PUT]: FormRequest.UPDATED,
  [HttpMethods.DELETE]: FormRequest.DELETED,
  [HttpMethods.PATCH]: FormRequest.PATCHED,
};

export interface FormServiceOptions {
  params?: HttpParams;
  body?: any;
  id?: unknown;
  action?: string;
}

@Injectable()
export class FormService implements OnDestroy {
  /** Path del servicio para manejar las peticiones http  */
  public controllerId!: string;

  /** Id de la vista del contenido del formulario */
  public viewComponentId!: string;

  /** Id del formulario o documento */
  public formId!: string | number;


  /** Alias de formId */
  public documentId!: string | number;

  /** Alias de documentVersion */
  public documentVersion!: string | number;

  /** Id de la transacción del formulario actual. */
  public transactionId = new Md5().appendStr(v4()).end()?.toString();

  /** Estado actual del formulario */
  public formStatus = new Subject<{ status: FormRequest; data?: any }>();

  private lastError = null;
  private lastResult: any = null;

  constructor(
    private http: HttpClient,
  ) { }


  ngOnDestroy(): void {
    let nooop;
  }

  fetch(path: string, data?: any): Observable<any> {
    return this.request(HttpMethods.GET, { params: data });
  }

  request(type: HttpMethods, options: FormServiceOptions): Observable<any> {
    // Start request loading
    this.formStatus.next({ status: FormRequest.LOADING, data: !0 });

    const httpOptions: Record<string, any> = {};

    httpOptions['params'] = {
      ...options.params,
      transactionId: this.transactionId,
      m: sessionStorage.getItem(STOREKEY.MODULE_ID), //this.localStore.get(STOREKEY.MODULE_ID),
      cid: this.viewComponentId,
    };

    let messg = 'Cargando...';

    if (HttpMethods.GET !== type) {
      httpOptions['body'] = options.body;
      messg = 'Actualizando...';
    }

    return this.http
      .request(
        HttpMethods[type],
        `${this.controllerId}/${options.id ?? ''}`,
        {
          body: httpOptions['body'],
          //params: httpOptions['params'],
        },
      )
      .pipe(
        tap({
          next: result => {
            this.lastResult = result;
            this.formStatus.next({ status: FormRequest.DONE, data: result });
          },
          error: err => {
            this.lastError = err;
            this.formStatus.next({ status: FormRequest.ERROR, data: err });
          },
          complete: () => {
            this.formStatus.next({ status: FormRequest.LOADING, data: !0 });
            this.formStatus.next({ status: FormStatusFromMethod[type], data: this.lastResult });
          },
        }),
      );
  }

  /**
   * Crear/Guardar contenido de un documento
   *
   * @param data Cuerpo del contenido del documento
   * @param options Opciones adicionales del formulario
   */
  create(data: any, options?: FormServiceOptions): Observable<any> {
    return this.request(HttpMethods.POST, {
      ...options,
      body: data,
    });
  }

  setControllerId(controllerId: string): void {
    this.controllerId = controllerId;
  }

  /**
   * Actualizar/Guardar contenido de un documento
   *
   * @param id Id del documento
   * @param data Cuerpo contenido del documento
   * @param options Opciones adicionales del formulario
   */
  update(id: unknown, data: any, options?: FormServiceOptions): Observable<any> {
    return this.request(HttpMethods.PUT, {
      ...options,
      id,
      body: data,
    });
  }

  /**
   * Eliminar un documento
   *
   * @param id Id del documento
   * @param options Opciones adicionales del formulario
   */
  delete(id: unknown, options?: FormServiceOptions): Observable<any> {
    return this.request(HttpMethods.DELETE, { ...options, id });
  }

  /**
   * Reemplaza parcialmente al documento.
   *
   * @param id Id del documento
   * @param options Opciones adicionales del formulario
   */
  patch(id: unknown, data: any, options?: FormServiceOptions): Observable<any> {
    return this.request(HttpMethods.PATCH, {
      ...options,
      id,
      body: data,
    });
  }

  get(id: any): Observable<any> {
    return this.request(HttpMethods.GET, { id });
  }

  print(componentId: string, formatId: string | number, obj: any): Observable<any> {
    return this.http.get('print', {
      params: {
        c: componentId,
        f: formatId,
        o: btoa('string' === typeof obj ? obj : JSON.stringify(obj)),
      },
      responseType: 'arraybuffer',
    });
  }

  /**
   * Validar contenido de una transaccion
   *
   * @param data Cuerpo del contenido del documento
   * @param options Opciones adicionales del formulario
   */
  preSave(data: any, id?: any, options?: any): Observable<any> {
    return this.http.post(
      `${options?.url}/${id ?? ''}`,
      data,
      {
        params: { ...options?.params, [PARAM_ID]: this.viewComponentId },
      })
      .pipe(
        tap(
          result => {
            this.lastResult = result;
          },
          err => {
            this.lastError = err;
          },
        ),
      );
  }

  noPermitido(): Observable<boolean> {
    return new Observable<boolean>(observer => {
      observer.next(false);
      observer.complete();
    });
  }
}
