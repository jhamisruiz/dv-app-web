import { Component, EventEmitter, Input, OnInit, Output, forwardRef } from '@angular/core';
import { AppTableService } from '../app-table/app-table.service';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs';
import { selectCompForm } from '@store/app/selectors/app.selectors';
import { ComponentModeType } from '@app/shared/common/interfaces';
import { AppStateStore } from '@store/app.state';
import { Store } from '@ngrx/store';

export interface Modulo {
  id?: number;
  nombre?: string;
  url?: string;
  icon?: string;
  class?: string;
  style?: string;
  orden?: number;
  habilitado?: boolean;
  componentes?: Componente[];
  index?: number;
  active?: boolean;
  selected?: boolean;
  indeterminate?: boolean;
}

export interface Componente {
  id?: number;
  nombre?: string;
  url?: string;
  icon?: string;
  id_menu?: number;
  orden?: number;
  style?: string;
  id_rol?: number;
  idrol_permiso?: number;
  user_create?: boolean;
  user_read?: boolean;
  user_update?: boolean;
  user_delete?: boolean;
  active?: boolean;
  selected?: boolean;
  indeterminate?: boolean;
}
interface ConfiRol {
  id: number;
  path: string;
}
@Component({
  selector: 'app-select-roles',
  templateUrl: './app-select-roles.component.html',
  styleUrls: ['./app-select-roles.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppSelectRolesComponent),
      multi: true,
    },
  ],
})
export class AppSelectRolesComponent implements OnInit {
  path?: string;
  id: number = 0;
  @Input() usuario_id: number = 0;

  @Input() set config(c: ConfiRol) {
    this.id = c?.id ?? 0;
    if (c?.path && this.id >= 0) {
      this.path = c?.path;
      this.getData(c?.path, c?.id ?? 0);
    }
  }

  @Input() set refresh(d: boolean | undefined) {
    if (d === true) {
      if (this.path && this.id >= 0) {
        if (this.isrefresh) {
          //this.getData(this.path, this.id);
        }
      }
    }
  }
  isrefresh = false;
  data: Modulo[] = [];
  ComponentMode: ComponentModeType = 'VIEW';

  @Output() OnChangeData = new EventEmitter<any[] | null>();
  @Output() dataResponse = new EventEmitter<any>();

  constructor(
    private sv: AppTableService,
    private store: Store<AppStateStore>,
  ) { }

  ngOnInit(): void {
    this.store.select(selectCompForm).subscribe((m: any) => {
      if (m) {
        this.ComponentMode = m;
      }
    });
    if (this.path) {
      //this.getData(this.path, this.id);
      this.isrefresh = true;
    }
  }

  getData(path: string, id: number): void {
    const dataObservable: Observable<Modulo[]> = id === 0 ?
      this.sv.getdataSource(`menu?userid=${this.usuario_id}`) :
      this.sv.get(`${path}/${id}`);

    dataObservable.subscribe((r: Modulo[]) => {
      this.setdataSource(r);
    });
  }

  setdataSource(r: Modulo[]): void {
    if (r.length) {
      this.data = r;
      this.data.forEach((v, i) => {
        this.data[i].active = false;
        this.data[i].selected = false;
        this.data[i].indeterminate = false;

        if (v?.componentes?.length) {
          const componentes: Componente[] = v?.componentes;
          componentes.forEach((cv, ci) => {
            componentes[ci].active = false;
            componentes[ci].selected = false;
            componentes[ci].indeterminate = false;
            this.switchActive(null, componentes[ci]);
          });
        }
        this.indeterminate(v);
      });

    }
  }

  onChange(e: any, d: Modulo): void {
    let val = false;
    if (e.target) {
      if (e.target.checked === true) {
        d.indeterminate = false;
        val = true;
      } else {
        d.indeterminate = false;
        d.selected = false;
        val = false;
      }
      if (d?.componentes?.length) {
        const componentes: Componente[] = d.componentes;
        componentes.forEach((v, i) => {
          componentes[i].active = val;
          componentes[i].selected = val;
          componentes[i].indeterminate = false;
          componentes[i].user_create = val;
          componentes[i].user_update = val;
          componentes[i].user_read = val;
          componentes[i].user_delete = val;
        });
      }
      this.dataResponse.emit(this.data ?? []);
    }
  }

  onChangeChild(e: any, d: Componente): void {
    let val = false;
    if (e.target) {
      if (e.target.checked === true) {
        d.indeterminate = false;
        val = true;
      } else {
        d.indeterminate = false;
        d.selected = false;
        val = false;
      }
      d.active = val;
      d.selected = val;
      d.indeterminate = false;
      d.user_create = val;
      d.user_read = val;
      d.user_update = val;
      d.user_delete = val;
      this.dataResponse.emit(this.data ?? []);
    }
  }
  switchActive(e: any, c: Componente): void {
    if (c.user_create === true && c.user_read === true && c.user_update === true && c.user_delete === true) {
      c.active = true; c.selected = true; c.indeterminate = false;
    } else if (c.user_create === false && c.user_read === false && c.user_update === false && c.user_delete === false) {
      c.active = false; c.selected = false; c.indeterminate = false;
    } else {
      c.active = true; c.selected = false; c.indeterminate = true;
    }
  }

  indeterminate(d: Modulo): void {
    const componente: Componente[] = d?.componentes ?? [];
    let countTrue = 0;
    let countFalse = 0;
    let countIndeterminate = 0;
    componente.forEach((v) => {
      if (v.selected === true) {
        countTrue = countTrue + 1;
      } if (v.selected === false) {
        countFalse = countFalse + 1;
      } if (v.indeterminate === true) {
        countIndeterminate = countIndeterminate + 1;
      }
    });

    if (countTrue > 0 && countFalse === 0) {
      d.active = true;
      d.selected = true;
      d.indeterminate = false;
    }
    if (countFalse > 0 && countTrue === 0) {
      d.active = false;
      d.selected = false;
      d.indeterminate = false;
    }
    if (countTrue > 0 && countFalse > 0) {
      d.active = true;
      d.selected = false;
      d.indeterminate = true;
    }
    if (countIndeterminate > 0) {
      d.active = true;
      d.selected = false;
      d.indeterminate = true;
    }
    this.dataResponse.emit(this.data ?? []);
  }


}
