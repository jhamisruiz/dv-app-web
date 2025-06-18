
export interface CompanyModule {
  id: number;

  /** Titulo del modulo */
  label: string;

  /** Url del modulo */
  path?: string;

  /** Idenitificador unico del componente */
  uuid?: string;

  /** El modulo se muestra en el menú */
  visible?: boolean;

  /** Icono del modulo */
  icon?: string;

  // fixme: Eliminar propiedad contradictoria
  isModule?: boolean;

  // FIXME: Indica si es home module, borrar.
  home?: boolean;
}
export class Modetype {
  isViewMode?: boolean;
  isPreViewMode?: boolean;
  isEditMode?: boolean;
  isCreateMode?: boolean;
  isDeleteMode?: boolean;
  formValid?: boolean;
}

export enum ComponentMode {
  CREATE = 'CREATE',
  EDIT = 'EDIT',
  VIEW = 'VIEW',
  DELETE = 'DELETE',
  PREVIEW = 'PREVIEW',
}
export enum PermisionMode {
  CREATE = 'user_create',
  READ = 'user_read',
  UPDATE = 'user_update',
  DELETE = 'user_delete',
}

export type ComponentModeType = keyof typeof ComponentMode;
export type PermisionModeType = keyof typeof PermisionMode;
