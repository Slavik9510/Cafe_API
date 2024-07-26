import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appScrollSpy]',
  standalone: true
})
export class ScrollSpyDirective {
  @Input() observableElement!: HTMLElement;
  @Input() offset: number = 0;

  constructor(private elementToShow: ElementRef<any>) { }


  @HostListener('window:scroll', [])
  onWindowScroll() {
    const bounding = this.observableElement.getBoundingClientRect();

    if (bounding.bottom >= this.offset) {
      this.elementToShow.nativeElement.style.visibility = 'hidden';
    } else {
      this.elementToShow.nativeElement.style.visibility = 'visible';
    }
  }
}
