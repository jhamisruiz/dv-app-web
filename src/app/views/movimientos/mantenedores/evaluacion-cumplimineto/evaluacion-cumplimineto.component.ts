import { Component, Injector, OnInit } from '@angular/core';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { AbstractDocument } from '@app/shared/common/classes';
import { AppTable } from '@app/shared/components/app-table/app-table.interface';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-evaluacion-cumplimineto',
  templateUrl: './evaluacion-cumplimineto.component.html',
  styleUrls: ['./evaluacion-cumplimineto.component.scss'],
  providers: [ConfirmationService],
})
export class EvaluacionCumpliminetoComponent extends AbstractDocument implements OnInit {

  fullPath = '/evaluacion-cumplimiento';

  headers: AppTable[] = [
    { field: 'id', label: 'id', visible: false },
    { field: 'documento', label: 'Documento', filter: true , dataoverlay: true,numberwords:5},
    { field: 'descripcion', label: 'Descripción', filter: true , dataoverlay: true,numberwords:5},
    { field: 'habilitado', label: 'habilitado', type: 'habilitado' },
  ];

  form: UntypedFormGroup = this.fb.group({
    id: [],
    id_empresa: [this.idempresa, [Validators.required]],
    documento: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    habilitado: [true],
  });

  constructor(injector: Injector, private confirmationService: ConfirmationService) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

}
