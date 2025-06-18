/* eslint-disable @typescript-eslint/no-unused-vars */
import { AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, Input, OnInit, Optional, Output, ViewChild } from '@angular/core';
import { AbstractControl, ControlContainer, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { nanoid } from 'nanoid';
import moment from 'moment';
//import 'src/resources/js/plugins/forms/tags/tokenfield.min.js';
import { INPUT_ERROR_MESSAGES, NsCustomFormControl } from '../../common/classes/form-controls.class';
import { cloneDeep } from 'lodash';
import { delay, Observable, of } from 'rxjs';

@Component({
  selector: 'app-input',
  templateUrl: './app-input.component.html',
  styleUrls: ['./app-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppInputComponent),
      multi: true,
    },
    {
      provide: NsCustomFormControl,
      useExisting: forwardRef(() => AppInputComponent),
      multi: true,
    },
  ],
})
export class AppInputComponent implements NsCustomFormControl, ControlValueAccessor, AfterViewInit, OnInit {
  @ViewChild('input') inputRef?: ElementRef;
  @Output() OnInput = new EventEmitter<string | number>();
  @Output() clear = new EventEmitter<any>();
  @Output() nsBlur = new EventEmitter<any>();
  @Output() OnFocus = new EventEmitter<any>();
  @Output() OnFocusOut = new EventEmitter<any>();
  @Output() keyArrowDown = new EventEmitter<any>();
  @Output() keyArrowUp = new EventEmitter<any>();
  @Output() OnKeyDown = new EventEmitter<any>();
  @Output() OnKeyUp = new EventEmitter<any>();
  @Output() keyTab = new EventEmitter<any>();
  @Output() keyEnter = new EventEmitter<any>();

  @Input() valueAsDate: Date | null | undefined;
  @Input() valueAsNumber?: number | null;
  @Input() formControlName = '';
  @Input() id = nanoid();
  @Input() size = 'sm';
  @Input() controlClass: string | undefined;

  @Input() name: string | undefined;
  @Input() rootClass?: string;
  @Input() showClear?: boolean;
  @Input() tags?: boolean;
  @Input() createTagOnBlur = true;
  @Input() tagsMinWidth = 70;
  @Input() tagsDelimiter = ',';
  @Input() nsNumber?: boolean;

  @Input() step?: number;
  @Input() maxlength?: number;
  @Input() mask?: string;
  @Input() showMask?: boolean;

  @Input() iconFeedbackLeft?: string;
  @Input() iconFeedbackRight?: string;
  @Input() iconFeedStyle?: string;

  @Input() styleInput?: string;
  @Input() textPreIcon?: string;
  @Input() stylePreIcon?: string;

  @Input() styleClass: string | undefined;
  @Input() class: string | undefined;
  @Input() style: string | undefined | any;

  @Input() labelStyle: string | undefined;
  @Input() labelClass: string | undefined;

  @Input() inputClass: string | undefined;
  @Input() inputStyle: string | undefined;

  @Input() errorMessage?: string;

  @Input() filter = true;
  @Input() required = false;
  borderRequired = false;
  required2 = false;
  borderRequired2 = false;
  @Input() disabled = false;
  @Input() readonly = false;

  @Input() inputType?: string | null;
  @Input() label: any;
  @Input() placeholder: string | undefined;
  @Input() value?: string | null;
  pruebavalue!: number;
  //input number
  @Input() min?: number;
  @Input() max?: number;
  @Input() showButtons = false;
  @Input() minFractionDigits?: number;
  @Input() inputStyleClass?: string;

  @Input() set MinDate(n: number) {
    if (n || n >= 0) {
      const hoy = new Date();
      const minimaFecha = new Date();
      if (n === 0) {
        minimaFecha.setDate(hoy.getDate());
      } else {
        minimaFecha.setDate(hoy.getDate() - n);
      }
      this.mindate = minimaFecha;
    }
  }
  @Input() set MaxDate(n: number) {
    if (n || n >= 0) {
      const hoy = new Date();
      const maximaFecha = new Date();
      if (n === 0) {
        maximaFecha.setDate(hoy.getDate());
      } else {
        maximaFecha.setDate(hoy.getDate() + n);
      }
      this.maxdate = maximaFecha;
    }
  }
  maxdate: any;
  mindate: any;
  ////textarea
  @Input() rows?: number;
  @Input() cols?: number;

  /** Formato por defecto de la fecha para el input control */
  @Input() set format(f: string) {
    this.dateFormat = f;
  }
  dateFormat = 'yy-mm-dd';

  @Input() dateNow = false;
  defaultDate?: Date;

  //INFO: para deshabilitar
  @Input() locked = false;

  /** Formato de máscara para el input */
  @Input() customMask = null;
  @Input() set watchDis(dis: any) {
    this.locked = dis;
  }

  public isDateType?: boolean;

  @Input() get type(): string {
    return this.inType;
  }


  set type(value: string) {
    this.isDateType = ('date' === value);
    this.inType = this.isDateType ? 'date' : value;
    this.inputType = value;
  }

  initRequired = false;

  public ADDON_PREPEND = 0;
  public ADDON_APPEND = 1;
  public element?: HTMLElement;

  private control?: AbstractControl;
  private inType = 'text';
  public hasErrorDate = false;
  public failOpenDate = '';
  public errorDate = false;
  validForm = false;
  public errorDateVigencia = false;
  public ref?: boolean;
  public messageError?: string;
  @Input() set formValid(err: any) {
    if (err) {
      this.validForm = true;
    }
    // if (err === true) {
    this.getError();
  }
  constructor(
    private readonly el: ElementRef,
    @Optional() private controlContainer: ControlContainer,
  ) {
    moment.locale('es' /*navigator.language*/);
    this.element = el.nativeElement;
  }
  public propagateChange = (_: any): void => { };
  public onTouched = (_: any): void => { };

  ngOnInit(): void {
    if (this.dateNow) {
      this.defaultDate = new Date();
    }
    this.getInputValid();
  }

  getInputValid(): void {
    const required = Object.keys(this.currentControl?.errors || {});
    if (this.inputType === undefined || this.type === undefined) {
      this.inputType = 'text';
    }
    this.initRequired = false;
    if (this.currentControl?.validator) {
      const rq: any = this.currentControl?.validator({} as AbstractControl);
      if (rq?.required === true) {
        this.initRequired = true;
      }
    }
    if (required[0] === 'required') {
      this.initRequired = true;
    }
    if (this.required === true) {
      this.borderRequired = true;
      this.getError();
    }
  }

  ngAfterViewInit(): void {
    if (this.inputType === 'calendar' && this.dateNow) {
      const now = new Date();
      this.onCalendarSelect(now.toISOString());
    }
  }
  selectDate(e: any): Observable<string> {
    const format = cloneDeep(this.dateFormat);
    const fechaOriginal = new Date(e);

    // Obtén los componentes de la fecha
    const year = fechaOriginal.getFullYear().toString(); // Obtén los últimos dos dígitos del año
    const month = ('0' + (fechaOriginal.getMonth() + 1)).slice(-2); // Añade cero al mes si es necesario
    const day = ('0' + fechaOriginal.getDate()).slice(-2); // Añade cero al día si es necesario
    // Construye la cadena de fecha en el formato deseado

    const fechaFormateada = format
      .replace('yy', year)
      .replace('mm', month)
      .replace('dd', day);
    return of(fechaFormateada).pipe(delay(1));
  }

  get currentControl(): AbstractControl | undefined {
    return this.controlContainer?.control?.get(this.formControlName) ?? void 0;
  }

  get hasError(): boolean {

    if (this.errorDate) {
      this.currentControl?.setErrors({ incorrect: true });
    }
    return !!this.currentControl?.errors;
  }

  get hasErrorVigencia(): boolean {
    if (this.errorDateVigencia) {
      this.currentControl?.setErrors({ incorrect: true });
    }
    return !!this.currentControl?.errors;
  }

  get _getError(): string {
    const [firstErrorKey] = Object.keys(this.currentControl?.errors || {});
    const firstError = this.currentControl?.errors?.[firstErrorKey];
    const errorMessage = INPUT_ERROR_MESSAGES[firstErrorKey] ?? '';
    const errorObject = 'object' === typeof firstError ? firstError : {};
    const al = errorObject?.actualLength;
    const rs = errorMessage.replace('${actualLength}', al);  //errorMessage.replace(/\$\{(\w+)\}/g, (_, ...[key]: any[]): string => errorObject[key]);
    return rs;
  }

  getError(): void {
    //this.messageError = this.errorMessage;
    const [firstErrorKey] = Object.keys(this.currentControl?.errors || {});
    const firstError = this.currentControl?.errors?.[firstErrorKey];
    const errorMessage = INPUT_ERROR_MESSAGES[firstErrorKey] ?? '';
    const errorObject = 'object' === typeof firstError ? firstError : {};
    this.messageError = errorMessage.replace(/\$\{(\w+)\}/g, (_: any, ...[key]: any[]): string => errorObject[key]);
    if (this.messageError === 'Este campo es requerido!') {
      if (this.errorMessage) {
        this.messageError = this.errorMessage;
        return;
      }
    }
    if (!(this.messageError) && this.required === true) {
      this.messageError = this.errorMessage;
    }
    if (this.currentControl?.value !== null || this.currentControl?.value !== undefined) {
      this.borderRequired = false;
      this.borderRequired2 = false;
      //this.messageError = '';
    }

    if (this.initRequired) {
      this.required2 = true;
      this.borderRequired2 = true;
    }
    if (this.currentControl?.value !== null || this.currentControl?.value !== undefined) {
      this.borderRequired2 = false;
    }
  }

  clearInput(): void {
    this.value = null;
    this.clear.emit();
  }

  get isFeedback(): boolean {
    return !!(this.iconFeedbackLeft || this.iconFeedbackRight || this.textPreIcon);
  }

  get isFeedbackIcon(): boolean {
    return !!(this.textPreIcon);
  }

  get _feedBackContainerClass(): { [key: string]: boolean } {
    return {
      'form-control-feedback': this.isFeedback,
    };
  }

  get dateMaxLength(): number {
    return this.dateFormat.length;
  }

  onCalendarSelect(e: any): void {
    this.selectDate(e).subscribe((r) => {
      this.value = r;
      this.OnInput.emit(r);
      this.propagateChange(r);
    });
  }

  onInpt(elm: any): void {
    if (elm.target.value.length > (this.maxlength ?? 0)) {
      elm.target.value = elm.target.value.slice(0, this.maxlength);
    }
    const realValue = +elm.target.value;
    this.OnInput.emit(realValue);
    this.propagateChange(realValue);
  }

  getReqError(): void {
    this.getError();
    //this.t
  }

  // ControlValueAccessor
  onChangeValue(elm: EventTarget): void {

    const element: HTMLInputElement = (elm as HTMLInputElement);
    this.value = element.value;
    this.valueAsDate = element.valueAsDate;
    this.valueAsNumber = element.valueAsNumber;

    this.borderRequired = true;
    if (!this.required) {
      this.borderRequired = false;
    }
    if (element.value) {

      if (this.required) {
        this.borderRequired = false;
      }
    }
    const realValue = 'number' === this.type ? element.valueAsNumber : this.value;
    this.OnInput.emit(realValue);
    this.propagateChange(realValue);
    this.getError();
    if (element.value && this.required === true) {
      this.messageError = '';
    }
    this.borderRequired2 = false;
  }

  onChangeValueIN(e: any): void {
    this.valueAsNumber = e.value;
    this.borderRequired = true;
    if (!this.required) {
      this.borderRequired = false;
    }
    if (e.value) {

      if (this.required) {
        this.borderRequired = false;
      }
    }
    const realValue = ('number' === this.type || 'number' === this.inputType) ? e.value : this.value;
    this.OnInput.emit(realValue);
    this.propagateChange(realValue);
    this.getError();

    this.borderRequired2 = false;
  }

  writeValue(value: string): void {
    if (value === undefined) {
      this.value = null;
      this.valueAsDate = null;
      this.valueAsNumber = null;
      return;
    }

    if (this.isDateType && moment(value, ['MM-DD-YYYY', 'YYYY-MM-DD']).isValid()) {
      this.value = moment(value, ['MM-DD-YYYY', 'YYYY-MM-DD']).format(this.dateFormat);
      this.valueAsDate = moment(value, ['MM-DD-YYYY', 'YYYY-MM-DD']).toDate();
      this.valueAsNumber = this.valueAsDate.getTime();
    } else {
      //const c: any = value;
      this.value = value;
      this.valueAsNumber = typeof value === 'number' ? +value : null;
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Custom control implementation

  getElementRef(): ElementRef<any> {
    return this.el;
  }

  isRequired(): boolean {
    return !!this.required;
  }

  isReadOnly(): boolean {
    return !!this.readonly;
  }

  isDisabled(): boolean {
    return !!this.disabled;
  }

  getId(): string {
    return this.id;
  }

  getValue(): any {
    return this.value;
  }

  setValue(value: any): void {
    this.writeValue(value);
  }

  setDisabled(value: boolean): void {
    this.setDisabledState(value);
  }

  setRequired(value: boolean): void {
    this.required = value;
  }

  setReadonly(value: boolean): void {
    this.readonly = value;
  }

  setSize(value: string): void {
    this.size = value;
  }
}
