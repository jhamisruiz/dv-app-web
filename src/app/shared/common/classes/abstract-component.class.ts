/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-bitwise */
import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Injector,

  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { LocalStoreService } from '@app/shared/services/local-store.service';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { v4 } from 'uuid';
import { APP_PHAT_COMPONENT, ENABLED_FIELD, ID_FIELD } from '../constants';
import { ComponentSyncStatus } from '../enums/component-sync-status.enum';
import { ComponentMode, ComponentModeType, WTab } from '../interfaces';
import { WintabOptions } from './wintabs.class';
import { AppStateStore } from '../../../store/app.state';
import { Router } from '@angular/router';
import { selectPermission } from '@app/store/app-menu/selectors/app-menu.selectors';
import { UserPermission } from '@app/shared/common/interfaces';

export enum ComponentStatus {
  NONE = 0,
  ERRORED = 1,
  DISABLED = 2,
  FOCUSED = 4,
  FETCHING = 8,
  SAVING = 16,
  UPDATING = 32,
  LOCKED = 64,
}

@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class AbstractComponent implements AfterViewInit, OnInit, OnDestroy {
  // Lista de componentes tipo AbstractComponent.
  static COMPONENTS: { [key: string]: { id: string; ref: AbstractComponent } } = {};

  // Usar focus event.
  @HostBinding('tabindex') tabIndex = '-1';

  // Set custom class
  @HostBinding('class.is-dynamic-component') isComponentClass = true;

  /** Establece un id de referencia del componente. */
  @HostBinding('attr.data-component-id') get dataId(): string {
    return this.nsUniqueId;
  }

  /** Bandera para indicar si es un componente personalizado */
  public nsComponent = true;

  /** UUID para identificar la instancia unica del componente */
  public nsUniqueId = v4();

  /** Target del componente */
  public element: HTMLElement;

  /** Fecha Unix de la creación de la instancia del componente */
  public createdAt = Date.now();

  /** Establece si es componente esta habilitado */
  public isEnabled!: boolean;

  /** Establece si el componente puede ser desactivado */
  public isDeactivatable = true;

  /** Establece si el componente está realizando una sincronización */
  public isLoading = false;

  /** Establece si el componente se encuentra activo (focus) */
  public isActive = false;

  /** Establece si el componente se sincroniza al iniciar la instancia */
  public isFetchable = false;

  /** Url del API de sincronización */
  public fetchPath = '';

  /** Modo de visualización del componente */
  public mode: ComponentModeType = ComponentMode.PREVIEW;

  /** Estado del componente */
  public get status(): Observable<ComponentStatus> {
    return this.status$.asObservable();
  }

  /** Indica que el componente se encuentra en modo de lectura */
  public isViewMode!: boolean;

  public isPreViewMode: boolean = false;

  /** Indica que el componente se encuentra en modo edición */
  public isEditMode: boolean = false;

  /** Indica que el componente se encuentra en modo creación */
  public isCreateMode: boolean = false;

  public isDeleteMode: boolean = false;

  /** Indica que el componente aún no está validado (funcionalidad exclusiva para movimientos, por defecto falso) */
  public isValidated = false;

  /** Identificador global del componente */
  public componentId!: string;

  /** Emitir los cambios de modo del componente */
  public onChangeMode = new EventEmitter<ComponentModeType>();

  /** Emitir los cambios de modo del componente */
  public onSubmitResponse = new EventEmitter<any>();

  /** Emitir los cambios de modo del componente */
  public onChangeStatus = new EventEmitter<ComponentStatus>();

  /** Detecta los cambios de estado del componente */
  public onSyncStatus = new EventEmitter<ComponentSyncStatus>();

  /** Detecta los cambios de estado de la data */
  public onSyncData = new EventEmitter<any>();

  /** Lista de etiquetas del componente. */
  public nsLabels: { key: string; value: unknown }[] = []; // TODO: verificar la utilización de etiquetas.

  /** Estado crudo del componente decuperado del store */
  public rawState: null | Record<string, any> = null;

  /** Data cruda de la data inciail del coponente */
  public rawData: null | Record<string, any> = null;

  /** Obtiene propiedad si es movimiento.  */
  protected elRef: ElementRef;

  /** Indica si esta siendo dibujado dentro del componente modal */
  protected inModal!: boolean;

  /** Indica si esta siendo dibujado dentro del componente wizard */
  protected inWizard!: boolean;

  /** App store access */
  //protected store: Store<AppStore>;

  protected persistence: LocalStoreService;


  /** Doom elements */
  protected render: Renderer2;

  /** Defaut http client */
  protected httpClient: HttpClient;

  protected store: Store<AppStateStore>;
  protected route: Router;
  protected Permission!: UserPermission;
  /** Custom logger service */
  //protected logger: NGXLogger;

  /** Destroy trigger */
  protected destroyTrigger = new Subject();

  /** Manejo del estado actual del componente. */
  protected status$ = new BehaviorSubject(ComponentStatus.DISABLED);
  protected fetching$ = new Subject<null | Record<string, any>>();


  constructor(injector: Injector) {
    this.elRef = injector.get(ElementRef);
    this.element = this.elRef.nativeElement;
    this.store = injector.get(Store<AppStateStore>);
    this.route = injector.get(Router);
    this.persistence = injector.get(LocalStoreService);
    this.render = injector.get(Renderer2);
    this.httpClient = injector.get(HttpClient);
    //this.logger = injector.get(NGXLogger);

    AbstractComponent.COMPONENTS[this.nsUniqueId] = {
      id: this.nsUniqueId,
      ref: this,
    };

    this.setActiveFromId(this.nsUniqueId);
    this.store.select(selectPermission).subscribe((p: UserPermission | null) => {
      if (p) {
        this.Permission = p;
      }
    });
  }

  @HostListener('focus') onFocus(): void {
    this.setActiveFromId(this.nsUniqueId);
  }

  ngOnInit(): void {
    console.log('[AbstractComponent] Hook: ngOnInit');
    console.log('[AbstractComponent] UUID:', this.nsUniqueId);

    if (this.isFetchable) {
      if (!this.fetchPath) {
        console.error('[AbstractComponent] Component is syncable, but path to sync not found ');
        return;
      }

      // Fetch...
      this.status$.next(ComponentStatus.FETCHING);
      console.log('[AbstractComponent] FETCHING', this.fetchPath);

      this.httpClient
        .get(this.fetchPath)
        .pipe(
          takeUntil(this.destroyTrigger),
        )
        .subscribe({
          next: data => {
            this.rawData = data;
            this.onSyncData.emit(data);
            //INFO: codigo inicial
            this.fetching$.next(data);
          },
          error: err => {
            this.status$.next(ComponentStatus.ERRORED);
            console.log('[AbstractComponent] ERRORED', err.message);
          },
          complete: () => {
            this.status$.next(ComponentStatus.NONE);
          },
        });
    }
  }

  ngAfterViewInit(): void {
    console.info('[AbstractComponent] Hook: ngAfterViewInit');
  }

  ngOnDestroy(): void {
    delete AbstractComponent.COMPONENTS[this.nsUniqueId];

    const [next] = Object.keys(AbstractComponent.COMPONENTS);

    next && this.setActiveFromId(next);

    this.destroyTrigger.next(0);
    this.destroyTrigger.complete();

    console.info('[AbstractComponent] Hook: ngOnDestroy');
  }

  /**
   * Cambiar el modo de presentación de un componente.
   *
   * @param mode Modo
   */
  changeMode(mode: ComponentModeType): void {
    this.mode = mode;
    //console/;p
    this.isViewMode = ComponentMode.VIEW === mode;
    this.isPreViewMode = ComponentMode.PREVIEW === mode;
    this.isEditMode = ComponentMode.EDIT === mode;
    this.isCreateMode = ComponentMode.CREATE === mode;
    this.isDeleteMode = ComponentMode.DELETE === mode;
    this.onChangeMode.emit(this.mode);
  }

  /**
   * Abrir un nuevo tab dentro del layout.
   *
   * @param mode Modo de presentación que inicia el componente.
   * @param wid Id del componente o vista contenedor del tab.
   * @param options Opciones adicionales del tab.
   */
  openWinTab(mode: ComponentModeType, wid: string, options = {} as WintabOptions): void {


    if (mode === ComponentMode.EDIT) {
      console.log('ComponentMode.EDIT...');
    }

    if (mode === ComponentMode.CREATE) {
      console.log('ComponentMode.CREATE...');
    }


    options || (options = {});

    const cid = options.componentId;
    //const title = options.title;
    //const icon = options.icon;
    // FIXME: Corregir y obtener propiedadades directamente.
    if (!cid && 'function' === typeof options.component) {
      // cid = ({ ...options.component }, MetaKey.ID);
      // title = ({ ...options.component }, MetaKey.TITLE);
      // icon = ({ ...options.component }, MetaKey.ICON);
    }

    if (ComponentMode.CREATE !== mode) {
      if (undefined === options.enabled && options.data) {
        options.enabled = options.data[ENABLED_FIELD]; // export const ENABLED = 'habilitado';
      }

      if (undefined === options.id && options.data) {
        options.id = options.data[ID_FIELD];
      }
    }

    if (void 0 !== wid) {
    }
  }

  // TODO: IMPLENTAR....
  resetWinTab(): void {

  }

  /**
   * Actualiza las propiedades de un tab.
   *
   * @param wid Id de componente o vista contenedor de tab
   * @param tid Identificador del tab
   * @param tab La información que se desea alterar en el tab
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateWinTab(wid: string, tid: string | number, tab: Partial<WTab>): void {
    //this.store.dispatch(WinTabActions.UpdateTab({ wid, tid, tab }));
  }

  /**
   * Cierra un tab del layout
   *
   * @param wid Id de componente o vista contenedor de tab
   * @param tid Identificador del tab
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  closeWinTab(wid: string, tid: string | number): void {
    //this.store.dispatch(WinTabActions.RemoveTab({ wid, tid }));
  }

  /**
   * Carga los labels al componente actual.
   */
  loadComponentLabels(): void {
    // this.service.syncComponentLabels(this.componentId).subscribe(data => {
    //   this.nsLabels = data;
    //   this.onSyncStatus.emit(ComponentSyncStatus.LABEL_LOADED);
    // });
    // return this.ws.get(WSCLIENT.GET_CUSTOM_LABELS, { cid });
  }

  /**
   * Resetea los labels del componente actual.
   *
   * @param cid Identificador del componente.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  resetComponentLabels(cid: string): Observable<any> {
    // return this.service.resetComponentLabels(cid);
    // return this.ws.get(WSCLIENT.RESET_CUSTOM_LABELS, { cid });
    return of();
  }


  private setActiveFromId(id: string): void {
    Object.keys(AbstractComponent.COMPONENTS).forEach(key => {
      AbstractComponent.COMPONENTS[key]?.ref?.changeActiveStatus(id === key ? ComponentStatus.FOCUSED : ComponentStatus.DISABLED);
    });
  }

  private changeActiveStatus(status: ComponentStatus): void {
    this.isActive = ComponentStatus.FOCUSED === status;

    this.status$.next(status);
    this.onChangeStatus.emit(status);

    if (this.isActive) {
      this.render.addClass(this.element, 'active');
      return;
    }

    this.render.removeClass(this.element, 'active');
  }
}
