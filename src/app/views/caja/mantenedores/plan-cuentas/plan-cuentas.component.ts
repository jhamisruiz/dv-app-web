
import { Component, Injector, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppStateStore } from '../../../../store/app.state';
import { AbstractDocument } from '@app/shared/common/classes';
import { UntypedFormGroup, Validators } from '@angular/forms';
interface PcgeAccount {
  code: string;
  name: string;
}

interface Mapping {
  pcgeAccount: string;
  category: string;
}

@Component({
  selector: 'app-plan-cuentas',
  templateUrl: './plan-cuentas.component.html',
  styleUrls: ['./plan-cuentas.component.scss'],
})
export class PlanCuentasComponent extends AbstractDocument implements OnInit {
  fullPath = '/plan-cuentas';
  items: any[] = [];
  form: UntypedFormGroup = this.fb.group({
    id: [],
    pcgeAccount: [null, Validators.required],
    category: ['', Validators.required],
  });

  pcgeAccounts: PcgeAccount[] = [
    { code: '10', name: 'Activo' },
    { code: '20', name: 'Pasivo' },
    { code: '30', name: 'Patrimonio' },
    // ... más cuentas PCGE según PCGE
  ];
  mappings: Mapping[] = [];

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();

  }

}
