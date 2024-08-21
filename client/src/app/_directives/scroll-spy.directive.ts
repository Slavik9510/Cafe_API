import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[appScrollSpy]',
  standalone: true
})
export class ScrollSpyDirective {
  @Input() observableElement!: HTMLElement;
  @Input() offset: number = 0;
  @Output() visibilityChanged: EventEmitter<boolean> = new EventEmitter();

  constructor(private elementToShow: ElementRef<any>) { }


  @HostListener('window:scroll', [])
  onWindowScroll() {
    const bounding = this.observableElement.getBoundingClientRect();

    if (bounding.bottom >= this.offset) {
      this.elementToShow.nativeElement.style.visibility = 'hidden';
      this.visibilityChanged.emit(false);
    } else {
      this.elementToShow.nativeElement.style.visibility = 'visible';
      this.visibilityChanged.emit(true);
    }
  }
}