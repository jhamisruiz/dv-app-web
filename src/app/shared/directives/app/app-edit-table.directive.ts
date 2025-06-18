import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appEditTable]',
})
export class AppEditTableDirective {
  @Output() tabClickOutside = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) { }

  @HostListener('document:click', ['$event.target'])
  onClick(target: HTMLElement): void {
    const clickedInside = this.elementRef.nativeElement.contains(target);
    console.log('clickedInside', clickedInside);
    if (!clickedInside) {
      this.tabClickOutside.emit();
    }
  }
}
