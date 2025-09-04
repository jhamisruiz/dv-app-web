/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import moment from 'moment';
import { Observable, delay, of } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Message } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { NUMEROS_NOMBRES } from '@app/shared/common/constants';
import { Table } from 'primeng/table';
import { cloneDeep } from 'lodash';
import { AppTableGrid, ParentVal } from './app-table-grid.interface';
import { AppTableGridService } from './app-table-grid.service';
import { ComponentModeType, UserPermission } from '@app/shared/common/interfaces';
import { Store } from '@ngrx/store';
import { AppStateStore } from '@store/app.state';
import { selectPermission } from '@store/app-menu/selectors/app-menu.selectors';
import { selectCompForm } from '@store/app/selectors/app.selectors';

@Component({
  selector: 'app-table-grid',
  templateUrl: './app-table-grid.component.html',
  styleUrls: ['./app-table-grid.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class AppTableGridComponent implements OnInit, OnDestroy {
  numeroNombres: string[] = NUMEROS_NOMBRES;
  @ViewChild('dt') tb!: Table;
  @Input() newRow: any;
  @Input() csv?: boolean;
  @Input() excel?: boolean;
  @Input() paginator = true;
  @Input() rowIndex = true;
  @Input() caption = true;
  @Input() rowBtn = true;
  @Input() modViewTab = false;
  @Input() selectionMode = 'single';
  @Input() pageRowInit = 50;
  @Input() tableCheckbox = false;
  @Input() addStart = false;
  @Input() crudStart = false;
  @Input() buttonInRow = false;
  @Input() tableName?: string;
  @Input() btnNewRow = true;
  @Input() btnEditRow = true;
  @Input() btnDelete = true;
  @Input() gridlines = false;
  //modal

  @Input() set headers(hds: AppTableGrid[]) {
    this.loading = true;
    hds.forEach((v, i) => {
      if (v?.type === 'suggest') {
        if (!v?.fieldname) {
          hds[i].fieldname = `obj_${v.field}`;
        }
      }
    });

    this.headersTable = hds;
    this.selectSuggests();
  }
  @Input() set dataSource(d: any[]) {
    this.getIsEditRow(false);
    this.data = d ?? [];
    this.data.forEach((v, i) => {
      this.data[i].index = i;
    });
    if (d === null) {
      this.data = [];
    }

    if (this.ComponentMode === 'EDIT') {
      this.getSelects();
    }
  }
  @Input() set edit(d: boolean) {
    this.getIsEditRow(d);
  }
  @Input() set totalRows(n: number) {
    this.numberRows = n ?? 0;
    if (this.execTotals) {
      this.addTotalRows();
    }
  }
  @Input() set addDias(n: number) {
    this.numberDias = n ?? 0;
    if (this.execTotals) {
      this.addTotalRows();
    }
  }
  @Input() locked = false;
  @Input() isDelete = true;
  @Input() isAdd = true;
  @Input() idsuggest!: number;

  @Output() OnSelectFiltro = new EventEmitter<any>();
  @Output() OnRefresh = new EventEmitter<any>();
  @Output() OnNew = new EventEmitter<any>();
  @Output() OnRowSelect = new EventEmitter<any>();
  @Output() OnRowSave = new EventEmitter<any>();
  @Output() OnFocus = new EventEmitter<any>();
  @Output() OnFocusOut = new EventEmitter<any>();
  @Output() keyArrowDown = new EventEmitter<any>();
  @Output() keyArrowUp = new EventEmitter<any>();
  @Output() OnKeyDown = new EventEmitter<any>();
  @Output() OnKeyUp = new EventEmitter<any>();
  @Output() keyTab = new EventEmitter<any>();
  @Output() keyEnter = new EventEmitter<any>();

  @Output() inEdition = new EventEmitter<any>();
  @Output() delResponse = new EventEmitter<any>();
  @Output() OnChangeData = new EventEmitter<any[] | null>();
  @Output() dataResponse = new EventEmitter<any>();

  @Output() OnTable = new EventEmitter<any>();
  toastPosition: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'center' = 'top-right';

  data: any[] = [];
  headersTable: AppTableGrid[] = [];

  Permission!: UserPermission;
  ComponentMode: ComponentModeType = 'VIEW';

  nombrecuadro = 'Imagenes';
  images: any[] = [];
  exportColumns: any[] = [];
  host = '';
  zip = '';
  imagenes: any[] = [];
  msgs: Message[] = [];
  editing = false;

  numberRows = 0;
  execTotals = false;
  numberDias = 0;
  inedit: any;
  isediting = false;
  isaddrow = false;
  required = false;
  cloneRow: any = {};
  currentEdit: any = [];
  dataDeleted: any[] = [];
  filterSelect: any[] = [];
  rowSelect = false;
  rowDisabledSelect = false;
  selectedIndex: any[] = [];
  rowData: any;
  loading = false;
  totalLoading = false;
  date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

  selectedData: any | any[] = [];

  constructor(
    private store: Store<AppStateStore>,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private primengConfig: PrimeNGConfig,
    private sv: AppTableGridService,
  ) {
  }

  ngOnInit(): void {
    this.store.select(selectPermission).subscribe((p: UserPermission | null) => {
      if (p) {
        this.Permission = p;
      }
    });

    this.store.select(selectCompForm).subscribe((m: any) => {
      if (m) {
        this.ComponentMode = m;
      }
      this.loading = false;
    });

    this.isediting = false;
    this.getIsEditRow(false);
    this.primengConfig.ripple = true;

    this.getSelects();
    this.execTotals = true;
    if (this.numberRows > 0) {
      this.addTotalRows();
    }
  }

  addTotalRows(): void {
    if (!this.locked) {
      const nuevoObjeto: any = {}; // Puedes personalizar el objeto como desees
      this.data.length = 0;
      for (let i = 0; i < this.numberRows; i++) {
        this.headersTable.forEach(v => {
          const field = v.field;
          nuevoObjeto[field] = v?.value ?? null;
          if (v.type === 'date') {
            const now = new Date();
            nuevoObjeto[field] = this.formatDate(this.fechaDespuesSumarDias(now, (this.numberDias * i)), v?.dateFormat ?? 'yy-mm-dd');
          }
        });
        nuevoObjeto.index = i;
        const obj = cloneDeep(nuevoObjeto);
        this.data.push(obj);
      }
    }
  }

  onCalendarSelect(e: any, d: any, f: string, df: string): void {
    this.selectDate(e, df).subscribe((r) => {
      d[f] = r;
    });
  }
  selectDate(e: any, df: string): Observable<string> {
    return of(this.formatDate(e, df)).pipe(delay(1));
  }
  formatDate(e: any, df: string): string {
    const format = cloneDeep(df);
    const fechaOriginal = new Date(e);

    const year = fechaOriginal.getFullYear().toString();
    const month = ('0' + (fechaOriginal.getMonth() + 1)).slice(-2);
    const day = ('0' + fechaOriginal.getDate()).slice(-2);
    const fechaFormateada = format
      .replace('yy', year)
      .replace('mm', month)
      .replace('dd', day);
    return fechaFormateada;
  }
  fechaDespuesSumarDias(e: any, d: number): Date {
    const nuevaFecha = new Date();
    nuevaFecha.setDate(nuevaFecha.getDate() + d);
    return nuevaFecha;
  }


  getIsEditRow(e: boolean): void {
    this.editing = e;
    this.sv.setChangeState(e);
  }

  selectCheckbox(): void {
    this.OnChangeData.emit(this.selectedIndex ?? []);
  }
  selectFiltro(e: any): void {
    this.OnSelectFiltro.emit(e);
  }

  onRowSelect(e: any): void {
    this.OnRowSelect.emit(e?.data ?? {});
    this.rowSelect = true;
    this.rowDisabledSelect = false;
    if (!this.editing) {
      this.rowData = {};
      this.rowData = e?.data ?? {};
    }
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

  selectSuggests(): any {
    this.headersTable.forEach((v, i) => {
      if (this.headersTable[i].type === 'suggest') {
        this.headersTable[i].data = v?.data ? v?.data : [];
      }
      if ((v?.type === 'select' && v?.url && v?.useUrl === undefined) || (v?.type === 'simpleSelect' && v?.url && v?.useUrl === undefined)) {
        const url = `${v.url}?start=0&length=62&search=&order=asc`;// + d[pnt.queryParent[0]];
        this.sv.select(url).subscribe((r: any) => {
          const data: any[] = r ?? [];
          v.data = data;
        });
      }
      if (v?.type === 'multiple' && v?.url) {
        this.sv.select(v?.url).subscribe((r: any) => {
          const data: any[] = r ?? [];
          v.data = data;
        });
      }
      if (v?.type === 'suggest' || v?.type === 'select') {
        this.getSugget(null, v, v?.url);
      }
    });

  }
  getSelects(): void {
    const d: any[] = this.data;
    this.headersTable.forEach((h, l) => {
      if (h?.useUrl === false) {

        this.data.forEach((v, i) => {
          const url = `${h.url}` + v[h.queryParent[0]];
          this.sv.select(url).subscribe((r: any) => {
            const data: any[] = r ?? [];
            const k = h?.keyData ?? 'data';
            v[k] = data;
          });
        });
      }
      if (d?.length && h?.type === 'suggest' || d?.length && h?.type === 'select') {
        //AGREGA UN PBJETO DEL FINDER AL FILDNAME DE LA ROW
        d.forEach((v, i) => {
          if (h?.data?.length) {
            const obj = h?.data.find((vh: any) => vh?.[h?.optionValue ?? ''] === v[h?.field]);
            if (obj) {
              d[i][h?.fieldname ?? ''] = obj;
              if (h?.field) {
                this.selected({ value: v[h?.field] }, v, null, h?.parentsVals ?? [], h);
              }
            }
          }
        });
      }
    });

  }

  filterData(e: any, h: any, url: any): void {
    this.getSugget(e.query ?? null, h, url);
  }

  getSugget(data: any, h: any, url: any): void {
    this.sv.suggest(data, url).subscribe((r: any) => {
      this.filterSelect = r?.length ? r : (r?.length ? r : []);
      h.data = r?.length ? r : (r?.length ? r : []);
      this.getSelects();

      this.loading = false;
    });
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

  changeData(): void {
    this.OnChangeData.emit(this.data);
  }

  onChangeNumber(d: any, h: AppTableGrid, val: any): void {
    if (h?.multiplication && h?.multiplication?.fieldA && h?.multiplication?.fieldB && h?.multiplication?.result) {
      const fieldA = h.multiplication.fieldA;
      const fieldB = h.multiplication.fieldB;
      const result = h.multiplication.result;

      if (d[fieldA] && d[fieldB]) {
        const resultado = Number(d[fieldA] ?? 0) * Number(d[fieldB] ?? 0);
        d[result] = (resultado).toFixed(2);
        this.errorStyle(d, h, d[result], h?.required ?? false, h?.parentsVals ?? []);
      } else {
        d[result] = null;
      }
    }
  }

  selected(e: any, d: any, f: any, parent: Array<ParentVal>, h: any): void {
    //select
    const id = e?.value > 0 ? e?.value : 0;
    const data: any[] = h?.data ?? [];
    if (data?.length) {
      const doc = data.find((n) => n.id === id);
      if (doc) {
        if (h?.fieldname && h?.type === 'select') {
          //AGREGA UN PBJETO DEL FINDER AL FILDNAME DE LA ROW
          d[h?.fieldname] = doc;
        }
        if (parent?.length) {
          parent.forEach((v, i) => {
            d[v.parentField] = doc[v.field];
            const obj = this.headersTable.find((vh: any) => vh?.field === v.parentField);
            if (obj) {
              if (obj?.multiplication) this.onChangeNumber(d, obj, d[obj?.field]);
              this.errorStyle(d, obj, d[obj?.field], obj?.required ?? false, obj?.parentsVals ?? []);
            }
          });
        }
      }
    }
  }

  selectedItemSgst(event: any, d: any, field: any, oVal: any, p: Array<ParentVal> | undefined): void {
    //parents
    const e = event && event.id ? event : event.value;
    if (e?.id || e[oVal]) {
      d[field] = e[oVal];
      if (p?.length) {
        p.forEach((v, i) => {
          if (v.field) {
            d[v.parentField] = e[v.field];
            const obj = this.headersTable.find((vh: any) => vh?.field === v.parentField);
            if (obj) {

              if (obj?.type === 'select') {
                const sdata = obj?.data ?? [];
                if (obj?.fieldname && sdata?.length) {
                  const obj_Value = obj?.obj_Value ?? 'id';
                  const sobj = sdata.find((sv: any) => sv[obj_Value] === e[v.field]);
                  d[obj.fieldname] = sobj ?? null;
                }
                if (obj?.parentsVals?.length) {
                  //this.selectedItemSgst({ id: d[obj?.field] }, d, obj?.field, null, obj?.parentsVals);
                  this.selected({ value: d[obj?.field] }, d, null, obj?.parentsVals, obj);
                }
              }
              if (obj?.type === 'suggest') {
                if (obj?.parentsVals?.length) {
                  //this.selectedItemSgst({ id: d[obj?.field] }, d, obj?.field, null, obj?.parentsVals);
                }
              }
              this.errorStyle(d, obj, d[obj?.field], obj?.required ?? false, obj?.parentsVals ?? []);
            }
          }

        });
      }
    }

  }
  onClearSuggt(e: any, d: any, f: any, p: Array<ParentVal> | undefined): void {
    d[f] = null;
    if (p?.length) {
      p.forEach((v, i) => {
        d[v.parentField] = null;
      });
    }
  }
  errorStyle(d: any, h: any, val: any, req: boolean | undefined, p: Array<ParentVal>): void {
    h.errStyle = undefined;
    if (h?.unique && this.data?.length > 1) {
      let conteo = 0;
      this.data.forEach((v, i) => {
        if (val && (v?.[h.field]) === (val)) {
          conteo++;
          if (conteo > 1) {
            h.errStyle = 'danger';
            const row = d;
            row[h.field] = null;
            if (p?.length) {
              p.forEach((v, i) => {
                d[v.parentField] = null;
              });
            }
            this.tb.initRowEdit(row);
            this.messageService.add({ severity: 'warning', summary: 'Warning', detail: 'El valor de ' + (h.label).toUpperCase() + ' ya existe!' });
          }
        }

      });
    }
    if (req) {
      if (val === null || val === undefined || val === '') {
        h.errStyle = 'danger';
      }
    }
  }

  addRowInTable(): void {
    if (this.Permission?.user_create === true) {
      this.isaddrow = true;
      const h: any[] = this.headersTable;
      const ob: any = {};

      h.forEach((v, i) => {
        ob[v.field] = null;
        if (v?.required) {
          this.required = true;
        }
        if (v?.value || v?.value === 0) {
          ob[v.field] = v?.value;
        }
      });

      ob.index = this.data.length;
      this.tb.value.push(ob);
      this.tb.initRowEdit(ob);
      this.isediting = true;
      this.OnTable.emit(this.isediting);
      this.getIsEditRow(true);
      this.rowData = ob ?? {};
    }
  }


  onRowEditInit(d: any): void {
    if (this.Permission?.user_update === true || this.Permission?.user_create === true) {
      if (!this.rowSelect) {
        this.messageUnSelect();
        return;
      }
      this.isediting = true;
      this.isaddrow = false;
      this.OnTable.emit(this.isediting);
      this.cloneRow = cloneDeep(d);
      this.getIsEditRow(true);
      this.currentEdit = d;
      this.tb.initRowEdit(d);
      //this.rowData = {};
      this.rowSelect = false;

      const h: any[] = this.headersTable;
      h.forEach((v, i) => {
        if (v?.required) {
          h[i].errStyle = undefined;
          if (d[v.field] === null || d[v.field] === undefined || d[v.field] === '') {
            this.required = true;
            h[i].errStyle = 'danger';
          }
        }
      });
    }
  }


  onRowEditSave(d: any): void {
    console.log('data', d);
    const h: any[] = this.headersTable;
    this.required = false;
    h.forEach((v, i) => {
      if (v?.required) {
        h[i].errStyle = undefined;
        if (d[v.field] === null || d[v.field] === undefined || d[v.field] === '') {
          this.required = true;
          h[i].errStyle = 'danger';
        }
      }

      if (v?.toUpperCase && d[v.field]) {
        d[v.field] = (d[v.field]).toUpperCase();
      }
    });
    this.getIsEditRow(false);
    if (!this.required) {

      //this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Datos guardados.' });
      this.isediting = false;
      this.OnTable.emit(this.isediting);
      this.isaddrow = false;
      this.tb.saveRowEdit(d, this.tb.el.nativeElement);
      this.tb.cancelRowEdit(this.cloneRow);
      this.tb.isRowEditing(d);
      this.cloneRow = {};
      this.getIsEditRow(false);
    }
    else {
      const index = this.data.length - 1;
      //delete this.data[index];
      this.isaddrow = this.isaddrow ? this.isaddrow : false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Completa los campos requeridos' });
      this.isediting = true;
      this.OnTable.emit(this.isediting);
      this.tb.initRowEdit(d);
      this.getIsEditRow(true);
    }
    this.dataResponse.emit(this.data);
    this.OnRowSave.emit(d);
  }

  onRowEditCancel(d: any, index: number): void {
    this.isediting = false;
    this.OnTable.emit(this.isediting);
    this.data[index] = this.cloneRow;
    if (this.isaddrow) {
      this.cloneRow = {};
      this.data.splice(index, 1);
      this.isaddrow = false;
    }

    this.tb.cancelRowEdit(this.cloneRow);
    this.getIsEditRow(false);
  }

  onRowEditDelete(d: any, rowData: any, index: number): void {
    if (
      this.Permission?.user_delete === true ||
      this.Permission?.user_create === true || this.Permission?.user_update === true
    ) {
      if (!this.rowSelect) {
        this.messageUnSelect();
        return;
      }
      //FIXME: cuando el boton sea en el header de la tabla (click)="onRowEditDelete(rowData, rowData, rowData?.index ?? 0)"
      const h: any[] = this.headersTable;
      const key = 'index';
      let id: any;
      const sel = h.find((v) => v?.[key]);
      if (sel) {
        id = sel?.id;
      }
      this.confirmationService.confirm({
        message: 'Seguro quieres eliminar?',
        header: 'Eliminar Columna',
        icon: 'pi pi-info-circle text-danger',
        accept: () => {
          //---fix
          if (rowData?.[id]) {
            delete this.cloneRow[rowData?.[id]];
            this.cloneRow = null;
            this.dataDeleted.push({
              id: rowData?.[id],
            });
            this.delResponse.emit(this.dataDeleted);
          }
          //---fix
          const indice = this.data.findIndex(ob => ob.index === d.index);
          this.data.splice(indice, 1);
          this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Columna eliminada.' });
          this.dataResponse.emit(this.data);
          this.getIsEditRow(false);
          this.rowSelect = false;
        },
      });
    }
  }

  onCellClick(d: any, h: any): void {
    if (h.celClick) {
      h.celClick(d);
    }
    const e = d;
    if (h.habilitar) {
      this.sv.habilitar(h.url, d.id, ((d[h.field]) ? 0 : 1)).subscribe((r) => {
        e.estado = 1;
        if (r === 'Habilitado') {
          this.messageService.add({ severity: 'success', summary: 'Estado', detail: '' + r });
        }
        if (r === 'Deshabilitado') {
          e.estado = 0;
          this.messageService.add({ severity: 'success', summary: 'Estado', detail: '' + r });
        }
      });
    }
  }

  messageUnSelect(): void {
    if (this.data?.length) {
      this.messageService.add({ severity: 'warning', summary: 'Warning', detail: 'Selecciona una columna' });
    }
  }

  outputSug(d: any, f: any, ov: any, ol: any, oc: any): any {

    const dr: any[] = d ? d : [];

    const c = dr.find((v) => v[ov] === f);
    if (c) {
      const res = `${oc ? (c[oc] + ' - ') : ''}` + c[ol];
      return res;
    }
  }

  outputSugLabs(d: any, f: any, ov: any, lbl: Array<string>, sep: string | undefined): any {
    const dr: any[] = d ? d : [];
    const c = dr.find((v) => v[ov] === f);
    if (c) {
      let res = '';
      if (lbl?.length) {
        lbl.forEach((v, i) => {
          if (i > 0) {
            const spd = (sep && i > 1) ? ` ${sep} ` : ' ';
            res += spd + c[v];
          }
        });
      }

      if (lbl?.length === 1) {
        res = c[lbl[0]];
      }
      return `${lbl?.length > 1 ? '<div class="p-1 pt-0 pb-0  m-0 badge-info">' + (c[lbl[0]]) + '</div>' : ''}
              <div class="pl-1">${res}
              </div>`;
    }
  }

  spaceCuenta(e: any, d: any): void {
    d = (d.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim()).toString();
    const v = e.target;
    v.value = d;
  }
  convertirDecimales(numero: number, minFractionDigits: number): string {
    const factor = Math.pow(10, minFractionDigits);
    const numeroRedondeado = Math.round(numero * factor) / factor;
    const numeroConDecimales = numeroRedondeado.toFixed(minFractionDigits);
    return numeroConDecimales;
  }
  ngOnDestroy(): void {
    //this.loading$.unsubscribe();
    if (1) { }
  }

}
