import { Component, Injector, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { AbstractDocument } from '@app/shared/common/classes';
import { NUMEROS_NOMBRES } from '@app/shared/common/constants';
import { AppTable } from '@app/shared/components/app-table/app-table.interface';
import { PrimeNGConfig } from 'primeng/api';
import { LocaleSettings } from 'primeng/calendar';

@Component({
  selector: 'app-empleado-reportes',
  templateUrl: './empleado-reportes.component.html',
  styleUrls: ['./empleado-reportes.component.scss'],
})
export class EmpleadoReportesComponent extends AbstractDocument implements OnInit {
  es: LocaleSettings = {
    firstDayOfWeek: 1,
    dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
    dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
    monthNamesShort: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
    monthNames: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
    today: 'Hoy',
    clear: 'Borrar',
    weekHeader: 'SM',
  };

  fullPath = '/empleado-asistencia';//asistencia
  newPhat = '';
  date: Date[] | undefined;

  headers: AppTable[] = [
    {
      field: 'idgrupo_empleado',
      label: 'grupo',
      type: 'select',
      data: this.dataGrupo,
      fieldname: 'objidGrupo',
      optionLabel: 'nombre',
      optionValue: 'id',
      dataKey: 'id',
    },
    {
      field: 'nombre_completo',
      label: 'nombres',
    },
  ];
  dateString = '';
  nombreMes = '';
  names = '';
  currentDayNumber = new Date().getDate();
  currentYearNumber = new Date().getFullYear();
  currentMontNumber = (new Date().getMonth()) + 1;
  currentDayName = '';
  collapsed = true;
  form: UntypedFormGroup = this.fb.group({
    id: [],
    id_empleado: [],
    valor: [true],
    fecha_creacion: [new Date().toISOString().slice(0, 10)],
    fecha_update: [],
    nombre: [],
    dia: [],
    fecha: [new Date().toISOString().slice(0, 10)],
    hora_inicio: [],
    hora_fin: [],
    valor2: [false],
  });
  daysInEachMonth = 0;

  displayModal = false;
  constructor(
    injector: Injector,
    private config: PrimeNGConfig,
  ) {
    super(injector);

  }

  ngOnInit(): void {
    super.ngOnInit();
    //const mont = new Date(this.form.value.fecha_creacion)
    this.config.setTranslation(this.es);
    //this.dateString = mont;
    this.getinfoMont(undefined);
    this.getcurrentDay(undefined);
    this.getPhat();
  }

  getinfoMont(n: number | undefined): void {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
    ];

    const fechaActual = new Date();
    const mesActual = n ?? fechaActual.getMonth();

    this.dateString = meses[mesActual];
    this.getNumDays(mesActual);
  }
  getNumDays(month: number): void {
    const year = new Date().getFullYear(); // Año actual
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    this.daysInEachMonth = lastDayOfMonth;
  }

  getcurrentDay(n: string | undefined): void {
    const currentDate = n ? new Date(n) : new Date();

    // Obtener el número del día actual
    this.currentDayNumber = currentDate.getDate();
    this.currentYearNumber = currentDate.getFullYear();
    this.currentMontNumber = (currentDate.getMonth()) + 1;
    // Obtener el nombre del día de la semana
    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const dayOfWeekIndex = currentDate.getDay();
    this.currentDayName = daysOfWeek[dayOfWeekIndex];
  }

  onMonthChange(e: any): void {
    this.getinfoMont(e?.month - 1);
    this.currentYearNumber = e?.year ?? 2023;
    this.currentMontNumber = e?.month;
    this.collapsed = false;
    this.getPhat();
  }
  onYearChange(): void {
    this.collapsed = false;
    this.getPhat();
  }

  onSelect(e: any): void {
    this.getcurrentDay(e);
    this.getPhat();
  }

  onShow(e: any): void {
    console.log('onShow', e);
  }

  handleClickOutside(): void {

    const elements = document.querySelectorAll('[appDelclas="true"]');

    if (this.collapsed) {
      elements.forEach(element => {
        if (element.classList.contains('show')) {
          element.classList.remove('show');
        }
      });
    }
    this.collapsed = true;
  }

  ///
  OnEdit(e: any): void {
    console.log('OnEdit', e);
  }

  onChangeSW(e: any, n: number): void {
    if (n === 1) {
      this.form.patchValue({
        valor: (e?.checked),
        valor2: e?.checked ? false : true,
      });
    } else {
      this.form.patchValue({
        valor2: (e?.checked),
        valor: e?.checked ? false : true,
      });
    }
  }

  OnRowSelect(e: any): void {
    const nm = NUMEROS_NOMBRES[(this.currentDayNumber) - 1];
    this.names = '';
    this.names = e?.nombre_completo;
    const data = e;
    if (data) {
      this.displayModal = true;
    }
    const as: any[] = data?.asistencia ?? [];
    if (as?.length) {
      const obj = as.find(item => item.nombre === nm);
      if (obj) {
        //update
        this.changeMode('EDIT');
        this.form.patchValue({
          id: obj.id,
          id_empleado: obj.id_empleado,
          valor: obj.valor,
        });
        if (!obj.valor) {
          this.form.patchValue({
            valor2: true,
          });
        }
      } else {
        //inert
        this.changeMode('CREATE');
        this.form.patchValue({
          id_empleado: e.id,
          nombre: nm,
          dia: this.currentDayNumber,
          fecha:
            `${this.currentYearNumber}-${this.currentMontNumber <= 9 ? 0 : ''}` +
            `${this.currentMontNumber}-${this.currentDayNumber <= 9 ? 0 : ''}${this.currentDayNumber}`,
        });
      }
      console.log('OnRowSelect', obj);
    } else {
      //debe registrar
      this.changeMode('CREATE');
      this.form.patchValue({
        id_empleado: e.id,
        nombre: nm,
        dia: this.currentDayNumber,
        fecha:
          `${this.currentYearNumber}-${this.currentMontNumber <= 9 ? 0 : ''}` +
          `${this.currentMontNumber}-${this.currentDayNumber <= 9 ? 0 : ''}${this.currentDayNumber}`,
      });
    }

    //NUMEROS_NOMBRES
  }

  getPhat(): void {
    this.newPhat
      = this.fullPath + `?search=${this.currentYearNumber}-${this.currentMontNumber <= 9 ? 0 : ''}${this.currentMontNumber}`;
  }
}
