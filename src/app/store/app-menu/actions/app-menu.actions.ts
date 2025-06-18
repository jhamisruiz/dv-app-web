import { UserPermission } from '@app/shared/common/interfaces';
import { createAction, props } from '@ngrx/store';
import { MenuTypes } from '@store/app.descriptions';


export const loadMenu = createAction(
  MenuTypes.loadMenu,
);

export const loadedMenuAction = createAction(
  MenuTypes.loadedMenu,
  props<{ dataMenu: any[] }>(),
);



export const loadedPermisosAction = createAction(
  MenuTypes.loadedPermisos,
  props<{ userPermission: UserPermission }>(),
);

