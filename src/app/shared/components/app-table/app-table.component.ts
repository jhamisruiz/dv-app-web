/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Message } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import moment from 'moment';
import { AppTable, ParentVal } from './app-table.interface';
import { AppTableService } from './app-table.service';
import { Table } from 'primeng/table';
import * as _ from 'lodash';
import { Observable, Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { NUMEROS_NOMBRES } from '@app/shared/common/constants';
import { Store } from '@ngrx/store';
import { AppStateStore } from '../../../store/app.state';
import { selectLoadingDataTable } from '../../../store/app-table/selectors/app-table.selectors';
import { loadTAbleAction, loadedTAbleAction } from '../../../store/app-table/actions/app-table.actions';
import { selectPermission } from '@store/app-menu/selectors/app-menu.selectors';
import { ComponentModeType, UserPermission } from '@app/shared/common/interfaces';
import { selectCompForm } from '@store/app/selectors/app.selectors';
import { environment } from 'src/environments/environment';

class Items {
  edit?: boolean;
  delete?: boolean;
  config?: boolean;
}

@Component({
  selector: 'app-table',
  templateUrl: './app-table.component.html',
  styleUrls: ['./app-table.component.scss'],
  providers: [ConfirmationService, MessageService],
})


export class AppTableComponent implements OnInit {
  numeroNombres: string[] = NUMEROS_NOMBRES;
  @ViewChild('dt') tb!: Table;

  ////////
  @Input() menuContext = true;//?: boolean;
  items: MenuItem[] = [];
  menuItem: Items = {};

  @Input() set headers(hds: AppTable[]) {
    // hds.forEach((v, i) => {
    //   this.globalFilterFields.push(v.field);
    //   if (v?.type === 'suggest') {
    //   }
    // });
    this.headerstab = hds;
    this.headerstabFilter = hds.filter(h => h.filter);
  }

  @Input() set dataSource(d: any[]) {
    if (d?.length) {
      this.data = d;
    }
  }

  @Input() set currentPath(url: string) {
    if (url) {
      this.currentSPath = url;
      this.getData(url);
    }
  }

  @Input() set inputSearch(s: string) {
    if (s) {
      this.tb.filterGlobal(s, 'contains');
    }
  }

  @Input() set refresh(d: boolean | undefined) {
    if (d === true) {
      this.getData(this.path ?? this.currentSPath ?? null);
    }
  }

  @Input() set edit(d: boolean) {
    this.getIsEditRow(d);
  }

  @Input() set LazyLoad(d: boolean) {
    this.loading = d;
  }

  @Input() newRow: any;
  @Input() csv?: boolean;
  @Input() exports = false;
  @Input() excel?: boolean;
  @Input() search = false;
  @Input() paginator = true;
  @Input() gridlines = true;
  @Input() resizableColumns = true;
  @Input() acciones = true;
  @Input() rowIndex = true;
  @Input() dblclick = true;
  @Input() selectableRow = true;
  @Input() selectionMode = 'single';
  @Input() pageRowInit = 50;
  @Input() tableCheckbox = false;
  @Input() sort = false;
  @Input() btnsMin = false;
  @Input() contextDisabled = false;
  @Input() btnEnable?: boolean;
  @Input() btnEdit?: boolean;
  @Input() btnDelete?: boolean;
  @Input() btnConfig?: boolean;
  @Input() iconBtnConfig?: string;
  @Input() btnHand?: boolean;
  @Input() btnSelect?: boolean;
  @Input() tableName?: string;
  @Input() path?: string;
  @Input() locked = false;
  @Input() isDelete = true;
  @Input() idsuggest!: number;
  @Input() get globalFilterFields(): string[] {
    return this.headerstab.reduce((a: string[], b: AppTable) => a.concat(b.filter ? b.field || '' : ''), []).filter(Boolean);
  }
  @Input() customDownloadTemplate: TemplateRef<any>;

  @Output() OnSelectFiltro = new EventEmitter<any>();
  @Output() OnRefresh = new EventEmitter<any>();
  @Output() OnNew = new EventEmitter<any>();
  @Output() OnEdit = new EventEmitter<any>();
  @Output() OnEnable = new EventEmitter<any>();
  @Output() OnSelect = new EventEmitter<any>();
  @Output() OnRowSelect = new EventEmitter<any>();
  @Output() OnDelete = new EventEmitter<any>();
  @Output() OnConfig = new EventEmitter<any>();
  @Output() OnTable = new EventEmitter<any>();
  @Output() OnBntClick = new EventEmitter<any>();
  @Output() OnBntExel = new EventEmitter<any>();
  toastPosition: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'center' = 'top-right';

  currentSPath?: string;
  filterGlobal = '';
  filterSearch = new Subject<string>();
  // globalFilterFields: string[] = [];
  data: any[] = [];
  headerstab: AppTable[] = [];
  headerstabFilter: AppTable[] = [];
  ComponentMode: ComponentModeType = 'VIEW';

  images: any[] = [];
  exportColumns: any[] = [];
  host = '';
  zip = '';
  imagenes: any[] = [];
  msgs: Message[] = [];

  rowSelect = false;
  rowDisabledSelect = false;
  selectedIndex: any[] = [];
  rowData: any;
  loading = false;
  loading$: Observable<any> = new Observable();
  totalLoading = false;
  date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

  selectedData: any | any[] = [];
  filtroprod = 1;
  dataoverlayPanel: any;
  constructor(
    private store: Store<AppStateStore>,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private primengConfig: PrimeNGConfig,
    private sv: AppTableService,
  ) {
    this.sv.refreshData.subscribe((r) => {
    });
    this.sv.isRefresh$.subscribe(r => {
      if (r) {
        this.OnRefresh.emit();
        this.getData(this.path ?? this.currentSPath ?? null);
      }
    });

    this.filterSearch.pipe(
      debounceTime(400),
      distinctUntilChanged())
      .subscribe(value => {
        console.log('value: ', value);
        this.tb.filterGlobal(value, 'contains');
      });
  }

  ngOnInit(): void {

    this.store.select(selectCompForm).subscribe((m: any) => {
      if (m) {
        this.ComponentMode = m;
      }
    });

    this.getIsEditRow(false);
    this.primengConfig.ripple = true;

    if (this.path) {
      this.getData(this.path);
    }
    this.menuItem = {
      edit: this.btnEdit,
      delete: this.btnDelete,
      config: this.btnConfig,
    };
    this.items = [
      {
        label: 'Editar', icon: 'text-success pi pi-fw pi-pencil',
        styleClass: `text-success ${this.optionItm('edit', this.menuItem) ? '' : 'd-none'}`,
        command: (e): void => this.editRow(this.rowData),
      },
      {
        label: 'Config', icon: `text-primary pi pi-fw ${this.iconBtnConfig ? this.iconBtnConfig : 'pi-cog'}`,
        styleClass: `text-primary ${this.optionItm('config', this.menuItem) ? '' : 'd-none'}`,
        command: (e): void => this.configR(this.rowData),
      },
      {
        label: 'Eliminar', icon: 'text-danger pi pi-fw pi-trash',
        styleClass: `text-danger ${this.optionItm('delete', this.menuItem) ? '' : 'd-none'}`,
        command: (e): void => this.deleteR(this.rowData, this.tableName ?? '', this.headerstab),
      },
    ];
  }

  // $events
  onChange(e: any, d: any, h: any): void {
    if (h?.function) {
      h?.function(e, d);
    }
  }
  // fin events
  getIsEditRow(e: boolean): void {
    //this.editing = e;
    this.sv.setChangeState(e);
  }

  getAsistencia(d: any[]): void {
    console.log('getAsistencia', d);
  }
  onContextMenu(e: any): void {
    this.rowData = e;
    this.contextDisabled = false;
    if (e?.idEstado === 2) {
      this.contextDisabled = true;
    }
  }

  optionItm(n: string, i: Items): boolean {

    if (i?.edit && n === 'edit') {
      return true;
    }
    if (i?.config && n === 'config') {
      return true;
    }
    if (i?.delete && n === 'delete') {
      return true;
    }
    return false;
  }

  selectFiltro(e: any): void {
    this.OnSelectFiltro.emit(e);
  }

  onRowSelect(e: any): void {
    this.OnRowSelect.emit(e?.data ?? {});
    this.rowSelect = true;

    const d = e?.data ?? {};
    if (d?.idEstado === 2) {
      this.rowSelect = false;
    }
  }
  onRowUnselect(e: any): void {
    this.rowSelect = false;
    if (!this.selectedIndex?.length) {
      this.selectedIndex = [];
      this.selectedIndex.length = 0;
    }
  }

  change(e: any, d: any, f: any, p: Array<ParentVal>): void {
    if (!e.target.value) {
      d[f] = null;
      if (p?.length) {
        p.forEach((v, i) => {
          d[v.parentField] = null;
        });
      }
    }
  }

  getData(path: string | null): void {
    if (path) {

      this.loading$ = this.store.select(selectLoadingDataTable);
      this.store.dispatch(loadTAbleAction());

      this.sv.getdataSource(path).subscribe(
        {
          next: (r: any) => {
            if (r?.length >= 0) {
              console.log('dataTable: ', r);
              const d: any[] = r ?? [];
              this.data = d;
              //this.loading = false;
              this.store.dispatch(loadedTAbleAction({ dataTable: d }));
              //
              this.rowSelect = false;
              this.selectedIndex = [];
              this.selectedIndex.length = 0;
            }
          },
          error: err => {
            this.store.dispatch(loadedTAbleAction({ dataTable: [] }));
          },
          complete: () => {
            //this.reset();
          },
        },
      );
    }
  }

  editRow(d: any): void {
    if (this.btnsMin && !this.rowSelect) {
      return;
    }
    this.OnEdit.emit(d);
    this.selectedIndex = [];
  }

  selectR(d: any): void {
    if (this.btnsMin && !this.rowSelect) {
      return;
    }
    this.OnSelect.emit(d);
  }

  enableR(d: any, h: any): void {
    this.OnEnable.emit(d);
    const idname = Object.keys(d)[0] ?? ''; //NOTE: extrae el primer parametro que sera el id
    this.confirmationService.confirm({
      message: 'Seguro quieres Actualizar?',
      header: 'Actualizar ' + (this.tableName),
      icon: 'pi pi-info-circle text-warning',
      accept: () => {
        this.OnEnable.emit(d);
        this.habilitar(d, h);
      },
    });
  }

  habilitar(d: any, h: any): void {
    const obj = h.find((v: any) => v.enablePath);

    if (obj?.enablePath) {
      const id = d[obj?.field];
      let url = `${obj?.enablePath}/${id}`;
      const ls = (obj.enablePath)[(obj.enablePath).length - 1];
      if (ls === '/') {
        url = `${obj?.enablePath}${id}`;
      }

      let qsp = '';
      const qp: any[] = obj?.querySPEnable ?? [];
      qp.forEach(nm => {
        if (nm?.field) {
          const prm = d[nm?.field];
          qsp += `/` + prm;
        }
        if (!nm?.field) {
          qsp += `/` + nm;
        }
      });
      if (id) {
        this.sv.saveData(url + qsp, null).pipe()
          .subscribe({
            next: (data: any) => {
              if (data?.isSuccessful) {
                if (data?.codigoMsg === 1) {
                  this.messageService.add({ severity: 'success', summary: this.tableName ?? 'Row', detail: `${this.tableName ?? 'Row'}  Eliminado` });
                  //this.auto = true;
                }
                if (data?.codigoMsg === 2) {
                  this.messageService.add({ severity: 'warn', summary: 'Warning', detail: `${data?.errorMessage}` });
                }
              }

            },
            error: err => { },
            complete: () => {
              //this.reset();
            },
          },
          );
      }

    }
  }

  deleteR(d: any, n: string, h: any): void {
    if (this.btnsMin && !this.rowSelect) {
      if (this.btnsMin) { }
      return;

    }
    this.confirmationService.confirm({
      message: 'Seguro quieres eliminar?',
      header: 'Eliminar ' + (n) + ' ' + (d?.codigo ?? d?.nombre ?? ''),
      icon: 'pi pi-info-circle text-danger',
      accept: () => {
        this.OnDelete.emit(d);
        this.eliminando(d, n, h);
      },
    });
  }

  btnFilesClick(d: any): void {
    if (this.btnsMin && !this.rowSelect) {
      return;
    }
    this.OnBntExel.emit(d);
  }
  buttonClick(d: any): void {
    if (this.btnsMin && !this.rowSelect) {
      return;
    }
    this.OnBntClick.emit(d);
  }

  configR(d: any): void {
    if (this.btnsMin && !this.rowSelect) {
      return;
    }
    this.OnConfig.emit(d);
  }

  eliminando(d: any, n: string, h: any): void {
    const obj = h.find((v: any) => v.delPath);
    if (obj?.delPath) {
      const id = d[obj?.field];
      let url = `${obj?.delPath}/${id}`;
      const ls = (obj.delPath)[(obj.delPath).length - 1];
      if (ls === '/') {
        url = `${obj?.delPath}${id}`;
      }

      let qsp = '';
      const qp: any[] = obj?.querySParams ?? [];
      qp.forEach(nm => {
        qsp += `/` + nm;
      });
      if (id) {
        this.sv.delete(url + qsp).pipe()
          .subscribe({
            next: (data: any) => {
              if (data?.isSuccessful) {
                if (data?.codigoMsg === 1) {
                  this.messageService.add({ severity: 'success', summary: n ?? 'Row', detail: `${n ?? 'Row'}  Eliminado` });
                  //this.auto = true;
                }
                if (data?.codigoMsg === 2) {
                  this.messageService.add({ severity: 'warn', summary: 'Warning', detail: `${data?.errorMessage}` });
                }
              }

            },
            error: err => {
              //console.log('error..', err);
            },
            complete: () => {
              //this.reset();
            },
          },
          );
      }

    }

  }

  convertirDecimales(numero: number, minFractionDigits: number): string {
    // Redondea el número a la cantidad específica de decimales
    const factor = Math.pow(10, minFractionDigits);
    const numeroRedondeado = Math.round(numero * factor) / factor;
    // Convierte el número redondeado a una cadena con la cantidad deseada de decimales
    const numeroConDecimales = numeroRedondeado.toFixed(minFractionDigits);
    return numeroConDecimales;
  }

  getValSeverity(status: boolean | string, data: any): any {
    if (typeof status === 'string' && Array.isArray(data)) {
      const value = data.find(i => i.dataKey === status);
      return value.dataKey;
    }

    switch (status) {
      case true:
        return 'Habilitado';
      case false:
        return 'Deshabilitado';
    }
  }

  getSeverity(status: boolean | string, data: any): any {
    if (typeof status === 'string' && Array.isArray(data)) {
      const color = data.find(i => i.dataKey === status);
      return color.color;
    }

    switch (status) {
      case true:
        return 'success';
      case false:
        return 'danger';
    }
    return 'warning';
  }

  getdataoverlayPanel(d: any): void {
    this.dataoverlayPanel = null;
    if (d) {
      this.dataoverlayPanel = d;
    }
  }

  obtenerPrimerasCincoPalabras(texto: string, number: number): string {
    // Dividir el texto en palabras
    const palabras = (texto || '').split(' ');

    // Seleccionar las primeras cinco palabras
    const primerasCincoPalabras = palabras.slice(0, number);

    // Unir las palabras nuevamente en una cadena
    const textoCorto = primerasCincoPalabras.join(' ');

    // Retornar las primeras cinco palabras
    return textoCorto + (primerasCincoPalabras?.length > (number - 1) ? '...' : '');
  }

}
