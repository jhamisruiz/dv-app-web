import { AfterContentInit, ContentChildren, Directive, ElementRef, HostListener, QueryList } from '@angular/core';
import { Boundaries } from './app-draggable';
import { AppChildDirective } from './app-child.directive';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appParent]',
})
export class AppParentDirective implements AfterContentInit {
  @ContentChildren(AppChildDirective) movables!: QueryList<AppChildDirective>;

  private boundaries!: Boundaries;
  private subscriptions: Subscription[] = [];

  constructor(private elementRef: ElementRef) { }

  ngAfterContentInit(): void {
    this.movables.changes.subscribe(() => {
      this.subscriptions.forEach(s => s.unsubscribe());

      this.movables.forEach((movable: any) => {
        this.subscriptions.push(movable.dragStart.subscribe(() => this.measureBoundaries(movable)));
        this.subscriptions.push(movable.dragMove.subscribe(() => this.maintainBoundaries(movable)));
      });
    });

    this.movables.notifyOnChanges();
  }

  @HostListener('window:resize') onResize(): void {
    this.movables.forEach((movable: any) => {
      this.measureBoundaries(movable);
      this.maintainBoundaries(movable);
    });
  }

  private measureBoundaries(movable: AppChildDirective): void {
    const viewRect: DOMRect = this.elementRef.nativeElement.getBoundingClientRect();
    const movableClientRect: DOMRect = movable.elementRef.nativeElement.getBoundingClientRect();

    this.boundaries = {
      minX: viewRect.left - movableClientRect.left + movable.position.x,
      maxX: viewRect.right - movableClientRect.right + movable.position.x,
      minY: viewRect.top - movableClientRect.top + movable.position.y,
      maxY: viewRect.bottom - movableClientRect.bottom + movable.position.y,
    };
  }

  private maintainBoundaries(movable: AppChildDirective): void {
    movable.position.x = Math.max(this.boundaries.minX, movable.position.x);
    movable.position.x = Math.min(this.boundaries.maxX, movable.position.x);
    movable.position.y = Math.max(this.boundaries.minY, movable.position.y);
    movable.position.y = Math.min(this.boundaries.maxY, movable.position.y);
  }

}
