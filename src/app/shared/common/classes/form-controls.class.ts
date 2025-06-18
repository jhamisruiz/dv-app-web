import { ElementRef } from '@angular/core';

export abstract class NsCustomFormControl {
  abstract getElementRef(): ElementRef;
  abstract isRequired(): boolean;
  abstract isReadOnly(): boolean;
  abstract isDisabled(): boolean;

  abstract getId(): string;
  abstract getValue(): any;
  abstract setValue(value: any): void;
  abstract setSize(value: string): void;

  abstract setDisabled(value: boolean): void;
  abstract setRequired(value: boolean): void;
  abstract setReadonly(value: boolean): void;
}


export const INPUT_ERROR_MESSAGES: Record<string, string> = {
  required: 'Este campo es requerido!',
  requiredTrue: 'Este valor debe ser marcado',
  email: 'Formato de correo inválido',
  minlength: 'Se requieren al menos ${requiredLength} caracteres. Actual: ${actualLength}',
  min: 'El número ingresado debe ser mayor o igual a $',
  maxlength: 'Solo está permitido el ingreso de ${requiredLength} caracteres.',
  max: 'El número ingresado debe ser menor o igual a $',
  pattern: 'El valor ingresado tiene un formato inválido',
  invalidUrl: 'Formato de Url inválido',
  invalidNumber: 'Solo se permiten números',
  codeExist: 'Este codigo ya existe',
  docExist: 'Este documento ya existe',
  periodClose: 'La fecha seleccionada se encuentra cerrada',
  periodExist: 'Fecha no registrada. ¡Asignar periodo!',
};
