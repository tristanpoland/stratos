import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

/* tslint:disable:directive-selector */

@Directive({
selector: 'button [mat-icon-button]',
standalone: false
})
export class ButtonBlurOnClickDirective {

  constructor(private elRef: ElementRef, private renderer: Renderer2) { }

  @HostListener('click') onClick() {
    this.elRef.nativeElement.blur();
  }
}
