import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgClass
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {
  isListVisible = false;
  isRotated = false;
  @ViewChild('locationList') locationList!: ElementRef;
  @ViewChild('sideMenu') sideMenu!: ElementRef;
  @ViewChild('subMenu') subMenu!: ElementRef;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  private toggleElement(element: ElementRef["nativeElement"]) {
    if (element.style.maxHeight) {
      element.style.maxHeight = null;
    } else {
      element.style.maxHeight = element.scrollHeight + 'px';
    }
  }

  isActiveRoute(routes: string[]): boolean {
    return routes.some(route => this.router.url.includes(route));
  }

  toggleLocationsList() {
    this.isListVisible = !this.isListVisible;
    const element = this.locationList.nativeElement;
    this.toggleElement(element);
  }

  openMenu() {
    this.sideMenu.nativeElement.style.display = 'block';
    document.body.style.overflow = 'hidden';

  }

  closeMenu() {
    this.sideMenu.nativeElement.style.display = '';
    document.body.style.overflow = '';
  }

  toggleSubMenu() {
    const element = this.subMenu.nativeElement;
    this.toggleElement(element);
    this.isRotated = !this.isRotated;
  }
}
