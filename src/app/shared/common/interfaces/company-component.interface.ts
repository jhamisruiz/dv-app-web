export interface CompanyComponent {
  /** Identificador unico por modulo  */
  id: string;

  /** Titulo o nombre del componente */
  label: string;

  /** Descripción del componente */
  description?: string;

  /** ID del modulo que corresponde el componente */
  module_id?: number; // fixme: Propiedades duplicadas
  moduleId: number;

  /** Id del modulo padre que corresponde */
  parent_id?: string; // fixme: Propiedades duplicadas
  parentId?: string;

  children?: CompanyComponent[]; // fixme: Propiedad no deberia existir en este nivel
  items?: CompanyComponent[]; // fixme: Propiedad no deberia existir en este nivel
  isParent?: boolean; // fixme: Propiedad no deberia existir en este nivel
  isChild?: boolean; // fixme: Propiedad no deberia existir en este nivel

  /** Tipo de componente */
  type: 'MENU' | 'TABLA' | 'VENTANA' | 'FORMULARIO';

  /** Id del tipo de componente */
  typeId: number;

  /** Url del componente, en caso tipo ventana/menu ventana o menu */
  path?: string;

  /** Url del componente, incluye modulo, en caso tipo ventana/menu ventana o menu */
  fullPath: string;

  /** Identificador unico del componente sin tomar en cuenta el modulo */
  uuid: string;

  /** Icono asinado al componente */
  icon?: string;
  badge?: string;

  /** Codigo de acceso rapido al componente tipo ventana/menu */
  accessCode?: string;

  /** Grupo al que pertenece el componente */
  group?: number;

  /** Orden */
  order?: number;

  /** Atajo del teclado para acceso rapido */
  shortcut?: string;

  isMenu: boolean;
  isTable: boolean;
  isForm: boolean;
  isWindow: boolean;
}
