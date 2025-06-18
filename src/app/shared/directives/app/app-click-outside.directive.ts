import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
})
export class AppClickOutsideDirective {
  @Output() appClickOutside = new EventEmitter<any>();

  constructor(private el: ElementRef) { }

  @HostListener('document:click', ['$event.target'])

  onClick(targetElement: HTMLElement): void {
    if (!this.el.nativeElement.contains(targetElement) && !targetElement.classList.contains('noDirective')) {
      this.appClickOutside.emit(targetElement);
    }
  }

}
