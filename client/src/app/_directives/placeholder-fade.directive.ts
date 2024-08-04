import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appPlaceholderFade]',
  standalone: true
})
export class PlaceholderFadeDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) { }

  @HostListener('focus') onFocus() {
    setTimeout(() => {
      this.renderer.addClass(this.el.nativeElement, 'placeholder-fade');
    }, 500);
  }

  @HostListener('blur') onBlur() {
    this.renderer.removeClass(this.el.nativeElement, 'placeholder-fade');
  }
}
