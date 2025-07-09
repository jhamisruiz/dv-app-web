import { Component, Injector, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup, Validators } from '@angular/forms';
import { AbstractDocument } from '@app/shared/common/classes';
import { AppTable } from '@app/shared/components/app-table/app-table.interface';
import { UniqueCode } from '@app/shared/validators/unique-code';
import { MenuBroadcastService } from '@services/broadcast-services/menu-broadcast.service';
import { loadMenu } from '@store/app-menu/actions/app-menu.actions';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
})
export class RolesComponent extends AbstractDocument implements OnInit {
  fullPath = '/rol';
  headers: AppTable[] = [
    { field: 'id', label: 'id', visible: false },
    { field: 'codigo', label: 'codigo Rol', filter: true },
    { field: 'nombre', label: 'nombre Rol', filter: true },
    { field: 'habilitado', label: 'habilitado', type: 'habilitado' },
  ];

  form: UntypedFormGroup = this.fb.group(
    {
      id: [null],
      codigo: [{ value: null, disabled: this.isEditMode }, [Validators.required, Validators.minLength(4)],
      Validators.composeAsync([UniqueCode(this.codeValidator.bind(this))])],
      nombre: ['', [Validators.required]],
      id_empresa: [1],
      habilitado: [true],
      detalle: [[], [Validators.required]],
    },
  );

  data: any = { value: 0 };
  reload = new Date();
  constructor(
    injector: Injector,
    private broadcastService: MenuBroadcastService,
  ) {
    super(injector);
    this.onSubmitResponse.subscribe(() => {
      this.reload = new Date();
      this.store.dispatch(loadMenu());
      this.broadcastService.updateMenuBroadcast();
    });
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  updatePermisosResponse(e: any[]): void {
    const fieldName = 'detalle';
    if (e !== null) {
      const f = this.form.get([fieldName]) as UntypedFormArray;
      f.patchValue(e);
    }
  }


}
