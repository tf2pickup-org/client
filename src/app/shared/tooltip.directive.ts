import {
  Overlay,
  OverlayPositionBuilder,
  OverlayRef,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { TooltipComponent } from './tooltip/tooltip.component';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[tooltip]',
})
export class TooltipDirective implements OnInit, OnDestroy {
  @Input('tooltip')
  text = '';

  @HostListener('mouseenter')
  show() {
    if (this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
    }

    const portal = new ComponentPortal(TooltipComponent);
    const tooltip = this.overlayRef.attach(portal);
    tooltip.setInput('text', this.text);
  }

  @HostListener('mouseleave')
  hide() {
    this.overlayRef.detach();
  }

  private overlayRef: OverlayRef;

  constructor(
    private readonly overlay: Overlay,
    private readonly overlayPositionBuilder: OverlayPositionBuilder,
    private readonly elementRef: ElementRef,
  ) {}

  ngOnInit() {
    const positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(this.elementRef)
      .withPositions([
        {
          originX: 'center',
          originY: 'top',
          overlayX: 'center',
          overlayY: 'bottom',
          offsetY: -5,
        },
        {
          originX: 'center',
          originY: 'bottom',
          overlayX: 'center',
          overlayY: 'top',
          offsetY: 5,
        },
      ]);

    this.overlayRef = this.overlay.create({ positionStrategy });
  }

  ngOnDestroy() {
    this.hide();
  }
}
