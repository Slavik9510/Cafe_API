import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { UserLogin } from '../_models/user-login.model';
import { Router } from '@angular/router';
import { UserRegister } from '../_models/user-register.model';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;
  loginSubmitted: boolean = false;

  constructor(private accountService: AccountService, private router: Router) {
    this.loginForm = new FormGroup({
      "login": new FormControl("", Validators.required),
      "password": new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(16)])
    });
    this.registerForm = new FormGroup({
      "username": new FormControl("", Validators.required),
      "email": new FormControl("", [Validators.required, Validators.email]),
      "password": new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(16)])
    });
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

  register() {
    if (!this.registerForm.valid) return;

    const registerDto: UserRegister = {
      userName: this.registerForm.controls["username"].value,
      email: this.registerForm.controls["email"].value,
      password: this.registerForm.controls["password"].value
    };

    this.accountService.register(registerDto).subscribe({
      next: () => this.router.navigateByUrl("/"),
      error: error => console.log(error)
    });
  }
}
