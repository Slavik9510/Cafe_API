import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { AccountService } from '../_services/account.service';
import { User } from '../_models/user.model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserLogin } from '../_models/user-login.model';

const hidden = {
  transform: 'translateX(-120%)'
};
const visible = {
  transform: 'translateX(0)'
};

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgClass,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
  animations: [
    trigger('openClose', [
      transition(':enter', [
        style(hidden),
        animate('0.3s ease', style(visible))
      ]),
      transition(':leave', [
        style(visible),
        animate('0.3s ease', style(hidden))
      ])
    ])
  ]
})
export class NavComponent {
  isListVisible = false;
  isRotated = false;
  isMobileMenuVisible = false;
  user: User | null = null;
  loginForm: FormGroup;
  loginSubmitted: boolean = false;
  @ViewChild('locationList') locationList!: ElementRef;
  @ViewChild('sideMenu') sideMenu!: ElementRef;
  @ViewChild('subMenu') subMenu!: ElementRef;
  constructor(private router: Router, private accountService: AccountService) {
    this.loginForm = new FormGroup({
      "login": new FormControl("", Validators.required),
      "password": new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(16)])
    });
  }

  ngOnInit(): void {
    this.accountService.currentUser$.subscribe(
      data => this.user = data
    );
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
    this.isMobileMenuVisible = true;
    document.body.style.overflow = 'hidden';
  }

  closeMenu() {
    this.isMobileMenuVisible = false;
    document.body.style.overflow = '';
  }

  toggleSubMenu() {
    const element = this.subMenu.nativeElement;
    this.toggleElement(element);
    this.isRotated = !this.isRotated;
  }
  login() {
    this.loginSubmitted = true;
    if (!this.loginForm.valid) return;

    const loginDto: UserLogin = {
      login: this.loginForm.controls["login"].value,
      password: this.loginForm.controls["password"].value
    };

    this.accountService.login(loginDto).subscribe({
      next: () => this.router.navigateByUrl("/"),
      error: error => console.log(error)
    });
  }

  logout() {
    this.accountService.logout();
    this.loginForm.reset();

    const dropdown = document.getElementById('account-dropdown');
    dropdown?.classList.add('hide-dropdown');
  }

  removeHide() {
    const dropdown = document.getElementById('account-dropdown');
    dropdown?.classList.remove('hide-dropdown');
  }

  private toggleElement(element: ElementRef["nativeElement"]) {
    if (element.style.maxHeight) {
      element.style.maxHeight = null;
    } else {
      element.style.maxHeight = element.scrollHeight + 'px';
    }
  }
}
