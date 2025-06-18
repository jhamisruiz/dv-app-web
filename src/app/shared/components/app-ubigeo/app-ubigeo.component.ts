import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppUbigeoService } from './app-ubigeo.service';
import { Ubigeo } from './app-ubigeo.interface';

@Component({
  selector: 'app-ubigeo',
  templateUrl: './app-ubigeo.component.html',
  styleUrls: ['./app-ubigeo.component.scss'],
})
export class AppUbigeoComponent implements OnInit {

  @Input() set setUbigeo(u: string | null | undefined) {
    if (u) {
      this.id_ubigeo = u;
      setTimeout(() => {
        this.setDepartamentos();
        this.cdRef.detectChanges();
      }, 10);
    }
  }

  @Output() NgModelResponse = new EventEmitter<any>();

  layoutMode!: string | null;

  departamentos: any[] = [];
  provincias: any[] = [];
  distritos: any[] = [];

  departamento: any;
  provincia: any;
  distrito: any;
  id_ubigeo: any;

  ubigeo: Ubigeo | undefined;

  constructor(
    private sv: AppUbigeoService, private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.layoutMode = document.documentElement.getAttribute('data-layout-mode');
    this.getDepartamentos();

  }
  getDepartamentos(): void {
    if (!(this.departamentos?.length)) { }
    this.sv.Departamento().subscribe((r) => {
      this.departamentos = r;
      this.setDepartamentos();
    });
  }

  setDepartamentos(): void {
    if (this.id_ubigeo) {
      const d = (this.id_ubigeo).substring(0, 2) + '0000';
      this.departamento = this.departamentos.find(vd => vd.id_ubigeo === d);
      this.getDepartamentoToProvincia();
    }

  }

  getDepartamentoToProvincia(): void {
    if (this.ubigeo !== undefined) {
      this.ubigeo = {
        departamento: null,
        provincia: null,
        distrito: null,
        ubigeo: null,
      };
    }
    this.provincia = null;
    this.provincias = [];
    this.distritos = [];
    this.distrito = null;
    if (this.departamento?.id_ubigeo) {
      this.sv.Provincia(this.departamento?.id_ubigeo).subscribe((r) => {
        this.provincias = r;
        this.setProvincia();
      });
    }
  }

  setProvincia(): void {
    if (this.id_ubigeo) {
      const d = (this.id_ubigeo).substring(0, 4) + '00';
      this.provincia = this.provincias.find(vd => vd.id_ubigeo === d);
      this.getProvinciaToDistrito();
    }
  }

  getProvinciaToDistrito(): void {
    this.ubigeo = {
      departamento: null,
      provincia: null,
      distrito: null,
      ubigeo: null,
    };
    if (this.provincia?.id_ubigeo) {
      this.distritos = [];
      this.distrito = null;

      this.sv.Distrito(this.provincia?.id_ubigeo).subscribe((r) => {
        this.distritos = r;
        this.setDistrito();

        this.id_ubigeo = null;
      });
    }
  }

  setDistrito(): void {
    if (this.id_ubigeo) {
      this.distrito = this.distritos.find(vd => vd.id_ubigeo === this.id_ubigeo);
      //this.dataUbigeo();
    }
  }

  getUbigeo(): void {
    this.ubigeo = {
      departamento: null,
      provincia: null,
      distrito: null,
      ubigeo: null,
    };
    if (this.distrito?.id_ubigeo) {
      this.id_ubigeo = null;
      this.dataUbigeo();
    }
  }

  resetUbigeo(): void {
    this.ubigeo = {
      departamento: null,
      provincia: null,
      distrito: null,
      ubigeo: null,
    };
    this.NgModelResponse.emit(this.ubigeo);
  }

  dataUbigeo(): void {
    this.ubigeo = {
      departamento: this.departamento?.Departamento,
      provincia: this.provincia?.Provincia,
      distrito: this.distrito?.Distrito,
      ubigeo: this.distrito?.id_ubigeo,
    };
    this.NgModelResponse.emit(this.ubigeo);
  }

}
