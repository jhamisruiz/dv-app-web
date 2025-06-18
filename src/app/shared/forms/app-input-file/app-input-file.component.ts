import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DataFile } from './app-input-file.interface';
import { nanoid } from 'nanoid';
@Component({
  selector: 'app-input-file',
  templateUrl: './app-input-file.component.html',
  styleUrls: ['./app-input-file.component.scss'],
})
export class AppInputFileComponent implements OnInit {
  @ViewChild('input') inputRef?: ElementRef;
  /**
   * @DataFile DataFile
   */
  @Input() set setDataFile(d: DataFile | undefined) {
    if (d?.nombre) {
      this.dataFile = d;
    }
  }
  @Input() base64 = false;
  @Input() id = nanoid();
  @Input() styleClass: string | undefined;
  @Input() class: string | undefined;
  @Input() style: string | undefined | any;

  @Input() labelStyle: string | undefined;
  @Input() labelClass: string | undefined;

  @Input() fileLabel: string | undefined;
  @Input() infoFile: string | undefined;

  @Input() inputClass: string | undefined;
  @Input() inputStyle: string | undefined;
  @Input() label: any;
  @Input() required = false;
  @Input() multiple = false;
  @Input() accept = '*.*';
  @Output() NgModelResponse: EventEmitter<any> = new EventEmitter<any>();

  @Input() imageHeight: number | undefined;
  @Input() imageWidth: number | undefined;

  errorMessage: string | null = null;

  initRequired = false;
  dataFile!: DataFile | null;
  files: any[] = [];
  file: any;
  constructor(
    private readonly el: ElementRef,
  ) { }

  ngOnInit(): void {
    if (1) { }
  }
  getElementRef(): ElementRef<any> {
    return this.el;
  }
  onFileChange(e: any): void {
    if (e.target.files && e.target.files.length) {
      if (this.imageHeight || this.imageWidth) {
        this.validateImages(e);
      }
      const files: any[] = e.target.files;
      Array.from(e.target.files).forEach((v, i) => {
        const f = files[i];
        this.files.push(files[i]);
        if (this.base64) {
          const reader = new FileReader();
          reader.readAsDataURL(files[i]);
          reader.onload = (): void => {
            let result = '';
            result = reader.result as string;
            this.dataFile = {
              id: i,
              data: result,
              nombre: f.name,
              create: true,
              url: null,
            };
            this.NgModelResponse.emit(this.dataFile);
          };
        }
      });
      if (!this.base64) {
        this.dataFile = {
          id: -1,
          data: this.files,
          nombre: 'multiple',
          create: true,
          url: null,
        };
        this.NgModelResponse.emit(this.dataFile);
      }
    }
  }

  deleteFile(): void {
    if (this.base64) {
      const nm = this.dataFile?.nombre;
      this.dataFile = { nombre: nm, delete: true };
      this.NgModelResponse.emit(this.dataFile);
      this.resetFileInput();
    }
  }

  validateImages(event: any): void {
    const file = event.target.files[0];

    if (file) {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e: any): void => {
        img.src = e.target.result;

        img.onload = (): void => {
          if (this.imageHeight) {
            if (img.height > (this.imageHeight ?? 0)) {
              this.errorMessage = `La altura (${img.height}px) de la imagen superar los ${this.imageHeight} píxeles.`;
              this.deleteFile();
            } else {
              this.errorMessage = null;
            }
          }
          if (this.imageWidth) {
            if (img.width > (this.imageWidth ?? 0)) {
              this.errorMessage = `El ancho (${img.width}px) de la imagen superar los ${this.imageWidth} píxeles.`;
              this.deleteFile();
            } else {
              this.errorMessage = null;
            }
          }
        };
      };

      reader.readAsDataURL(file);
    } else {
      this.errorMessage = 'Por favor, seleccione una imagen.';
    }
  }

  resetFileInput(): void {
    const fileInput = document.getElementById(this.id) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}
