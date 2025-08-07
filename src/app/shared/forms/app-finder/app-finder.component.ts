/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Optional, Output, forwardRef } from '@angular/core';
import { AbstractControl, ControlContainer, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AppFinderService } from './app-finder.service';
import { Subject } from 'rxjs';
import { nanoid } from 'nanoid';
import { INPUT_ERROR_MESSAGES, NsCustomFormControl } from '@app/shared/common/classes/form-controls.class';
@Component({
  selector: 'app-finder',
  templateUrl: './app-finder.component.html',
  styleUrls: ['./app-finder.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppFinderComponent),
      multi: true,
    },
    {
      provide: NsCustomFormControl,
      useExisting: forwardRef(() => AppFinderComponent),
      multi: true,
    },
  ],
})
export class AppFinderComponent implements NsCustomFormControl, OnInit, ControlValueAccessor {
  @Output() nsBlur = new EventEmitter<any>();
  @Output() nsFocus = new EventEmitter<any>();
  @Output() keyArrowDown = new EventEmitter<any>();
  @Output() keyArrowUp = new EventEmitter<any>();
  @Output() keyTab = new EventEmitter<any>();
  @Output() keyEnter = new EventEmitter<any>();


  @Input() id = nanoid();
  @Input() formControlName!: string;

  @Input() inputValue: string | number | undefined;
  ///
  @Input() styleClass: string | undefined;
  @Input() class: string | undefined;
  @Input() style: string | undefined;
  @Input() panelStyle: string | undefined;
  @Input() panelStyleClass: string | undefined;
  @Input() required = false;
  @Input() disabled = false;
  @Input() locked = false;
  @Input() readonly = false;

  @Input() multiselect = false;
  @Input() simple = true;

  @Input() label?: string;
  @Input() labelClass?: string;
  @Input() field?: string;
  @Input() placeholder: string | undefined;
  @Input() optionValue: string | undefined;
  @Input() Labels: Array<string> = [];
  @Input() separador: string | undefined;

  @Input() queryStrParams: string | undefined;

  @Input() showClear = false;

  @Input() set dataSource(d: any[]) {
    this.data = d ?? [];
  }
  @Input() set currentPath(url: string) {
    if (url) {
      this.pathCurrent = url;
      //this.getData(url, this.queryStrParams);
    }
  }
  @Input() set formValid(err: any) {
    if (err) {
      this.validForm = true;
    }
    // if (err === true) {
    this.getError();
  }
  //
  /** @Event On select item code/label */
  @Output() selectChange = new EventEmitter<any[] | null>();
  /** @Event On select item code/label */
  @Output() OnChange = new EventEmitter<any[] | null>();
  @Output() OnPanelHide = new EventEmitter<any[] | null>();

  @Output() OnClear = new EventEmitter<any>();

  data: any[] = [];
  pathCurrent: any;
  ///
  filterSelect: any[] = [];
  //params = new QueryParamsDetail();
  public descriptionValue = '';
  private destroyTrigger$ = new Subject();
  private selectDefault?: string;
  private isRemoteSource!: boolean;
  public value = '';

  @Input() errorMessage?: string;
  @Input() borderRequired = false;
  required2 = false;
  borderRequired2 = false;
  initRequired = false;
  validForm = false;
  layoutMode!: string | null;
  public messageError?: string;
  public errorDateVigencia = false;
  public propagateChange = (_: any): void => { };
  public onTouched = (_: any): void => { };

  constructor(
    @Optional() private controlContainer: ControlContainer,
    private sv: AppFinderService,
    private readonly el: ElementRef,
    private readonly cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.layoutMode = document.documentElement.getAttribute('data-layout-mode');
    if (this.pathCurrent) {
      const qsp = `start=0&length=10&search=${''}&order=asc`;
      //this.getData(this.pathCurrent, qsp);
    }
    this.getInputValid();
  }

  search(e: any): void {
    const qsp = `start=0&length=10&search=${e?.query ?? ''}&order=asc`;
    this.getData(this.pathCurrent, qsp);
    // this.suggest(p).subscribe((r: any[]) => {
    //   this.filterSelect = r?.length ? r : [];
    // });
  }

  getData(path: string | null, qsp: any): void {
    if (path) {
      const p = path + `?${qsp ?? 'start=0&length=10&search=&order=asc'}`;
      this.sv.getdataSource(p).subscribe((r: any) => {
        if (r) {
          const d: any[] = r ?? [];
          this.data = d;
          if (this.inputValue && this.optionValue) {//fixme:
            const id = this.optionValue;
            const sel = d.find((v) => v?.[id] === Number(this.inputValue));
            this.descriptionValue = sel[id] ?? null;
          }
        }
      });
    }
  }

  getInputValid(): void {
    const required = Object.keys(this.currentControl?.errors || {});

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
      this.required2 = true;
      this.borderRequired = true;
      this.borderRequired2 = true;
      this.getError();
    }

  }

  writeValue(value: any): void {
    if (this.pathCurrent) {
      const p = this.pathCurrent + `?start=0&length=10&search=${value}&order=asc`;
      this.sv.getdataSource(p).subscribe((r: any) => {
        if (r) {
          const d: any[] = r ?? [];
          this.data = d;
          this.descriptionValue = value ?? null;
          this.selectChange.emit((value ?? null));
          if (this.optionValue) {
            if (d.length) {
              const id = this.optionValue;
              const sel = d.find((v) => v?.[id] === Number(value));
              this.descriptionValue = sel ?? null;
              this.selectChange.emit((sel ?? null));
            }
          }
          if (value) {
            this.getError();
          }
        }
      });
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  selectedItem(e: any): void {
    this.selectChange.emit(e);
    this.OnClear.emit(e);
    this.propagateChange((e?.id));
  }

  change(e: any): void {
    if (!e.target.value) {
      this.selectChange.emit(null);
      this.propagateChange(null);
    }
  }

  onPanelHide(e: any): void {
    this.OnPanelHide.emit(e);
  }

  onSelect(e: any): void {
    const id = this.optionValue ?? this.formControlName;
    const value =e?.value;
    const v = value?.[id] ?? null;
    this.propagateChange(v);
    this.OnChange.emit(e?.value ?? 'Error en OnSelect event emitter');
    this.getError();
  }

  onFocus(): void {
  }
  onClear(e: any): void {
    this.OnClear.emit(e);
    this.getError();
    if (!e) {
      this.propagateChange(null);
    }
  }
  onBlur(e: any): void {
    this.getError();
    if (!(e?.target?.value)) {
      this.propagateChange(null);
    }
  }

  onHide(e: any): void {
    this.getError();
  }
  suggest(p: any): any {
    // const parms = new QueryParamsDetail();
    // const prms = parms.params(p);
    // return this.http.get<any>(`/proveedores?${prms}`);
  }
  /* /// */

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
    const [firstErrorKey] = Object.keys({ required: true } || {});
    const firstError = this.currentControl?.errors?.[firstErrorKey];
    const errorMessage = INPUT_ERROR_MESSAGES[firstErrorKey] ?? '';
    const errorObject = 'object' === typeof firstError ? firstError : {};
    this.messageError = errorMessage.replace(/\$\{(\w+)\}/g, (_, ...[key]: any[]): string => errorObject[key]);
    if (this.messageError === 'Este campo es requerido!') {
      if (this.errorMessage) {
        this.messageError = this.errorMessage;
        return;
      }
    }
    if (!this.messageError && this.required === true) {
      this.messageError = this.errorMessage;
    }

    if (this.currentControl?.value) {
      this.borderRequired2 = false;
      //this.messageError = '';--
    }

    if (this.initRequired) {
      this.required2 = true;
      this.borderRequired2 = true;
    }
    // if (this.currentControl?.value) {
    //   this.borderRequired2 = false;
    // }
    if (this.descriptionValue) {
      this.borderRequired2 = false;
      this.required2 = false;
    }
    if (!this.initRequired && this.currentControl?.value) {
      //this.messageError = '';
    }
    if (this.currentControl?.validator) {
      const rq: any = this.currentControl?.validator({} as AbstractControl);
      if (this.descriptionValue && rq?.required === true) {
        this.required2 = false;
      }
    }
  }

  get currentControl(): AbstractControl | undefined {
    return this.controlContainer?.control?.get(this.formControlName) ?? void 0;
  }

  get hasError(): boolean {
    return !!this.currentControl?.errors;
  }
  // Custom control implementation
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

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

  setSize(value: string): void {
    // this.size = value;
  }
  setDisabled(value: boolean): void {
    this.setDisabledState(value);
    this.cdr.detectChanges();
  }

  selectedSuggest(name: any): void {
    this.descriptionValue = name.label;
  }

  setRequired(value: boolean): void {
    this.required = value;
    this.cdr.detectChanges();
  }

  setReadonly(value: boolean): void {
    this.readonly = value;
    this.cdr.detectChanges();
  }
}
