/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, OnDestroy } from '@angular/core';
import { WSCLIENT, WSSERVER } from '@app/config';
import { NGXLogger } from 'ngx-logger';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { WebSocketMessage } from 'rxjs/internal/observable/dom/WebSocketSubject';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from 'src/environments/environment';
import { v4 } from 'uuid';
import { UserService } from '../user.service';

const TRANSACTION_OPCODE = 1;

type Payload = { [key: string]: any };

interface FrameResponseOptions {
  transactionId?: string;
  isTransaction?: boolean;
}

interface FrameResponse {
  opcode: number;
  options?: FrameResponseOptions;
  value?: any[];
}

interface EventMap {
  [key: string]: ReplaySubject<any>;
  [key: number]: ReplaySubject<any>;
}

export enum WStatus {
  OFFLINE,
  ONLINE,
  CONNECTING,
  ERROR
}

@Injectable({
  providedIn: 'root',
})
export class WebsocketService implements OnDestroy {
  protected subscribers: EventMap = {};
  protected ws: WebSocketSubject<any>;

  private retries = 0;
  private maxRetries = Infinity;
  private status$ = new BehaviorSubject(WStatus.OFFLINE);
  private onMessage$ = new Subject();
  private stackMessages: any[] = [];
  private maxStack = 100;
  private currentStack = 0;
  private openObserver = new Subject();
  private closeObserver = new Subject();
  private isConnected = false;
  private retrying!: boolean;

  constructor(
    private logger: NGXLogger,
    private user: UserService,
  ) {
    this.ws = webSocket({
      url: `ws${environment.wsSSL ? 's' : ''}://${environment.wsHost}`,
      binaryType: 'arraybuffer',
      serializer: this.serializer,
      deserializer: this.deserializer,
      openObserver: this.openObserver,
      closeObserver: this.closeObserver,
    });

    this.openObserver.subscribe(() => {
      this.status$.next(WStatus.ONLINE);
      this.isConnected = true;
    });

    this.closeObserver.subscribe(() => {
      this.status$.next(WStatus.OFFLINE);
      this.isConnected = false;
    });

    this.on(WSSERVER.HI)
      .subscribe(e => {
        this.send(WSCLIENT.LOGIN, {
          uid: this.user.userId,
          sid: this.user.sessionId,
          token: this.user.userToken,
        });
      });
  }

  /**
   * Establece la comunicación con el servidor.
   *
   * @param token Token de usuario actual
   */
  init(): void {
    this.status$.next(WStatus.CONNECTING);

    this.ws.subscribe({
      next: this.onMessage.bind(this),
      error: err => {

        this.isConnected = false;
        this.status$.next(WStatus.ERROR);

        this.logger.error('WebsocketService Error ', err);

        this.retrying = true;

        setTimeout(() => {
          this.retryConnection();
        }, 10e3);
      },
      complete: () => {
        this.isConnected = false;
        this.status$.next(WStatus.OFFLINE);
      },
    });
  }


  ngOnDestroy(): void {
    this.close();
  }

  /**
   * Enviar tramas al servidor de websocket.
   *
   * @param opcode Identificador de la solicitud
   * @param data Trama de datos
   */
  send(opcode: number, data?: any, options?: any): void {
    this.ws.next({ opcode, data, options });
    this.logger.log(`[WS Send] `, { opcode, data, options });
  }

  /**
   * Suscribirse a una solicitud.
   *
   * @param opcode Identificador de la solicitud
   */
  on<T = Payload>(opcode: number): Observable<T> {
    if (!this.subscribers[opcode]) {
      this.subscribers[opcode] = new ReplaySubject(1);
    }
    return this.subscribers[opcode].asObservable();
  }

  /**
   * Obtiene un recurso de manera asincrona
   *
   * @param opcode Identificador de la solicitud
   * @param data Data de la solicitud
   */
  get<T = any>(opcode: number, ...data: any[]): Observable<T> {
    const transactionId = v4();

    if (!this.subscribers[transactionId]) {
      this.subscribers[transactionId] = new ReplaySubject(1);
    }

    this.send(TRANSACTION_OPCODE, data, {
      transactionId,
      opcode,
    });

    return this.subscribers[transactionId].asObservable();
  }

  /**
   * Terminar todas las sessiones y la actual.
   */
  close(): void {
    for (const k of Object.keys(this.subscribers)) {
      if (undefined !== this.subscribers[k]) {
        this.subscribers[k]?.unsubscribe();
        delete this.subscribers[k];
      }
    }

    this.isConnected = false;
    this.ws?.error({ code: 3001, reason: 'Cerrado por el usuario.' });
    // this.ws?.unsubscribe();
    this.ws.complete();
  }


  private serializer(value: any): WebSocketMessage {
    const data = JSON.stringify(value);
    const encoder = new TextEncoder();
    const buf = encoder.encode(data);

    for (let b = 0; b < buf.length; b++) {
      // eslint-disable-next-line no-bitwise
      buf[b] ^= 165;
    }

    return buf;
  }

  private deserializer(event: MessageEvent): FrameResponse {
    const data = event.data;
    const buf = new Uint8Array(data);
    const decoder = new TextDecoder('utf-8');

    if (data instanceof ArrayBuffer) {
      for (let f = buf.length, h = 0; h < f; h++) {
        // eslint-disable-next-line no-bitwise
        buf[h] ^= 219;
      }
    }

    let opcode: number;
    let options: FrameResponseOptions = {};
    let value: any;

    try {
      opcode = buf[0];
      value = decoder.decode(buf.slice(1));
      value = JSON.parse(`[${value}]`);
    } catch {
      throw new Error('A ocurrido un error decodificando el mensaje remoto. ');
    }

    if (TRANSACTION_OPCODE === opcode) {
      options = {
        transactionId: value[1],
      };

      value = value.slice(1);
    }

    return { opcode: buf[0], value, options };
  }

  private processStack(): void {
    if (this.stackMessages.length && this.currentStack <= this.maxStack) {
      const message = this.stackMessages.pop();

      if (message && message.opcode) {

        this.send(message.opcode, message.data, {
          transactionId: message.wstransactionId,
        });

        this.currentStack++;
        setTimeout(() => {
          this.processStack();
        }, 200);
      }
    }
  }

  get status(): Observable<WStatus> {
    return this.status$.asObservable();
  }

  private retryConnection(): void {
    if (this.retries < this.maxRetries) {

      this.logger.log('Reintentando conexión remota...');

      this.init();
      this.retries++;
    }
  }

  /**
   * Gestiona los mensajes y eventos
   *
   * @param data Response
   */
  private onMessage(data: FrameResponse): void {
    const subjectId = `${data?.options?.transactionId ?? data.opcode}`;
    const subject = this.subscribers[subjectId];

    // TODO: subject.closed
    if (void 0 !== subjectId && subject) {
      subject.next(data.value);

      if (data?.options?.isTransaction) {
        subject.complete();
      }
    }

    this.onMessage$.next(data);
    this.logger.log(`[WS Recv] `, data);
  }

}
