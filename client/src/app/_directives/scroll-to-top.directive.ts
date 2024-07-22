import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appScrollToTop]',
  standalone: true
})
export class ScrollToTopDirective {
  @HostListener('click')
  onClick() {
    window.scrollTo(0, 0);
  }
}
