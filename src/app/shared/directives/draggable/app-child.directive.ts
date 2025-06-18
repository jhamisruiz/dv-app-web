/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Directive, ElementRef, HostBinding,
  HostListener, Input, Renderer2, ViewChild,
} from '@angular/core';
import { AppDraggableDirective } from './app-draggable.directive';
import { Position } from './app-draggable';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Directive({
  selector: '[appChild]',
})
export class AppChildDirective extends AppDraggableDirective {
  @HostBinding('style.transform') get transform(): SafeStyle {
    return this.sanitizer
      .bypassSecurityTrustStyle(`translateX(${this.position.x}px) translateY(${this.position.y}px)`);
  }

  @HostBinding('class.movable') movable = true;
  @HostBinding('class._events') _event = false;

  @ViewChild('appDiv') appDiv!: ElementRef;

  @Input() appReset = false;
  @Input() appKey!: string;

  position: Position = { x: 0, y: 0 };

  private startPosition!: Position;

  parent: any;
  parentChild: any;
  constructor(
    private renderer: Renderer2,
    private sanitizer: DomSanitizer,
    public elementRef: ElementRef,
  ) {
    super();
  }

  @HostListener('dragStart', ['$event'])
  onDragStart(event: PointerEvent): void {
    this.startPosition = {
      x: event.clientX - this.position.x,
      y: event.clientY - this.position.y,
    };
  }

  @HostListener('dragMove', ['$event'])
  onDragMove(event: PointerEvent): void {
    this.position.x = event.clientX - this.startPosition.x;
    this.position.y = event.clientY - this.startPosition.y;
  }

  @HostListener('dragEnd', ['$event'])
  onDragEnd(e: PointerEvent): void {
    const target = e.target as HTMLElement;
    //const isParent = target.getAttribute('isParent');
    //this.renderer.appendChild(target, s);
    //console.log('onDragEnd', e);
    const elementos = document.querySelectorAll('._events');
    elementos.forEach((elemento: Element) => {
      elemento.classList.remove('_events');
    });
    //console.log('elementos', elementos);
    if (this.appReset) {
      this.position = { x: 0, y: 0 };
    }
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(e: any): void {


    const target = e.target as HTMLElement;

    //console.log('this.appDiv', this.appDiv);
    target.classList.add('_events');
    //this._event = true;
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(e: any): void {


    const el = e.target as HTMLElement;
    const offsetParent = el.offsetParent as HTMLElement;

    const elements = Array.from(offsetParent?.children || []);


    const elementoDeseado = this.findElementByAttribute(elements, 'appKey', 'uno');
    elementoDeseado?.classList.remove('_events');

    console.log('eleme-elementos-ntoDeseador', elementoDeseado);
    //const isParent = target.getAttribute('isParent');
    //this.renderer.appendChild(elemento, this.parentChild);
    //this.parentChild.classList.add('_events');
    //this.appDiv.nativeElement.classList.remove('_events');
  }

  private findElementByAttribute(elements: any[], attributeName: string, attributeValue: string): Element | null | undefined {
    return elements.find((element: Element) => element.querySelectorAll(`[${attributeName}="${attributeValue}"]`));
  }
  // private getChildren(): any[] {
  //   const el = this.elementRef.nativeElement.offsetParent;
  //   const els: HTMLCollection[] = el.children;
  //   return
  // }

  private removeClass(el: Element): void {
    el.classList.remove('_events');
  }
}
