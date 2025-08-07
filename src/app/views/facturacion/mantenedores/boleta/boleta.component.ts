import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-boleta',
  templateUrl: './boleta.component.html',
  styleUrls: ['./boleta.component.scss'],
})
export class BoletaComponent implements OnInit {

  data: any[] = [];
  activeEmpresa = false;
  activeCliente = false;
  activeDetalle = false;
  constructor() { }

  ngOnInit(): void {
    if (1) { }
  }

}
