import { NgFor } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductCartService } from '../_services/product-cart.service';
import { ProductCartItem } from '../_models/product-cart-item.model';
import { SelectSearchComponent } from '../select-search/select-search.component';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgFor, SelectSearchComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  cartItems: ProductCartItem[] = [];
  orderForm: FormGroup;
  loginForm: FormGroup;
  deliveryOptions: { [key: string]: string };

  @ViewChild('login') loginDiv!: ElementRef;

  constructor(private cartService: ProductCartService) {
    this.orderForm = new FormGroup({
      "name": new FormControl("", Validators.required),
      "phoneNumber": new FormControl("", Validators.required),
      "city": new FormControl("", Validators.required),
      "address": new FormControl("", Validators.required),
      "email": new FormControl("", [Validators.required, Validators.email]),
      "additionalInfo": new FormControl(),
    });

    this.loginForm = new FormGroup({
      "login": new FormControl(),
      "password": new FormControl()
    });
    this.deliveryOptions = {
      "City 1": "City 1 - 100 грн",
      "City 2": "City 2 - 200 грн",
      "City 3": "City 3 - 300 грн",
      "City 4": "City 4 - 400 грн",
      "City 5": "City 5 - 500 грн",
      "City 6": "City 6 - 600 грн",
      "City 7": "City 7 - 700 грн",
    };
  }
  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(
      data => this.cartItems = data
    );
  }

  getOrderTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }
  placeOrder() {
    console.log(this.orderForm);
  }

  toggleLogin() {
    const loginElement = this.loginDiv.nativeElement;
    if (loginElement.style.maxHeight) {
      loginElement.style.maxHeight = null;
    } else {
      loginElement.style.maxHeight = loginElement.scrollHeight + 'px';
    }
  }

  onCityChanged(data: string) {
    console.log(data);
  }
}
