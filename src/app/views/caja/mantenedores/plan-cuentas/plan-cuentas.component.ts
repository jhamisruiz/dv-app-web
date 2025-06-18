
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppStateStore } from '../../../../store/app.state';

@Component({
  selector: 'app-plan-cuentas',
  templateUrl: './plan-cuentas.component.html',
  styleUrls: ['./plan-cuentas.component.scss'],
})
export class PlanCuentasComponent implements OnInit {

  items: any[] = [];

  constructor(private store: Store<AppStateStore>) { }

  ngOnInit(): void {
    if (1) { }

  }

}
