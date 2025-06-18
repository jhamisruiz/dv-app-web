import { isDevMode } from '@angular/core';
import { nanoid } from 'nanoid';
import { MapFactory } from '../classes';
import { SetMetadata } from './metadata.decorator';

export const enum DocumentType {
  /** Alias of MOVEMENT */
  MOV,
  /** Alias of MAINTAINER */
  MNT,
  /** Alias of REPORT */
  RPT,

}


export const enum DocumentLayout {
  BASIC,
  TREE,
  ADJUST,
}

export interface NsDocumentOptions {
  readonly id?: string;
  /** Titulo personalizado del documento. */
  title?: string;
  /** Icono personalizado del documento */
  icon?: string;
  /** Ruta el Api que controla el CRUD de los formularios del documento. */
  readonly formControllerId?: string;
  /** ComponentId de la tabla que muestra los registros del documento. */
  readonly tableComponentId?: string;
  /** Identificador de la ventana */
  readonly viewComponentId?: string;
  /** Id de la sección del formulario de donde se envia la petición al Api */
  formTagId?: string;
  /** Inidica que el componente es de tipo documento, */
  readonly isDocument?: boolean;
  /** Indica que el componente es de tipo movimiento. */
  isMovement?: boolean;
  /** Indica que el componente es de tipo mantenedor */
  isMaintainer?: boolean;
    /** Indica que el componente puede ser contabilizado */
  isContab?: boolean;
  /*get tags*/
  tag?: boolean;
     /** Indica que el detalle del componente puede ser archivado */
  isArchived?: boolean;
  /** Indica que el componente se almacena para mostrarse en el layout */
  tracking?: boolean;
  /** Estilo con el que se muestra el documento. */
  layout?: DocumentLayout;
  /** Tipo de documento */
  type?: DocumentType;
  /** Cambiar el tipo de actualización de los campos del documento */
  partialUpdate?: boolean;
  /** Almancena la información el localstorage o indexdb para envitar que se pierda al actualizar. */
  readonly persistent?: boolean;

  /** Indica si el documento es recuperable( sincronizar ) al iniciar */
  fetchable?: boolean;
  contable?: boolean;

  /** Para indicar si se puede ver el botón de HABILITAR/DESHABILITAR */
  showBtnDisable?: boolean;

  /* Para poder calificar un documento usando las calificaciones */
  canRate?: boolean;

  /* Para poder subir archivos */
  uploadFile?: boolean;
}


const initialOptions: NsDocumentOptions = {
  layout: DocumentLayout.BASIC,
  tracking: true,
  isDocument: true,
  isMovement: false,
  type: DocumentType.MNT,
  persistent: false,
  fetchable: false,
  contable: false,
  tag: true,
  canRate: false,
  uploadFile: false,
};

export const NsDocument = (options?: NsDocumentOptions): (target: any) => void => (target: any): void => {
  const id = isDevMode() ? target.name : nanoid();
  options = { ...initialOptions, ...options };

  if (options?.isMovement) {
    options.type = DocumentType.MOV;
    options.partialUpdate = false;
    options.fetchable = true;
    options.contable = true;
  }

  if (options?.isMaintainer) {
    options.type = DocumentType.MNT;
  }

  options.isMovement = DocumentType.MOV === options?.type;
  options.isMaintainer = DocumentType.MNT === options?.type;
  options.partialUpdate = options.partialUpdate ?? options.isMaintainer;
  options.showBtnDisable = options?.showBtnDisable ?? true;

  SetMetadata(target, { id, ...options });

  if (false !== options?.tracking) {
    MapFactory.addComponent(id, target);
  }
};
