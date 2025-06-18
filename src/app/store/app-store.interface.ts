import { UserPermission } from '../shared/common/interfaces';
import { ComponentModeType } from '../shared/common/interfaces/company-module.interface';

export interface AppTableState {
  loading: boolean, dataTable: ReadonlyArray<any>
}

export interface AppCompFormState {
  loading: boolean, formMode: Readonly<ComponentModeType | null>, id: Readonly<number | null>
}

export interface AppUnspscState {
  loading: boolean, codigo: Readonly<string | null>,
}

export interface AppMenuState {
  loading: boolean, dataMenu: Array<any>,
}

export interface AppPermissionState {
  userPermission: UserPermission | null,
}

export interface AppFormSaveState {
  loading: boolean, form: any,
}
