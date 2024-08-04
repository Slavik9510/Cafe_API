import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProductCartService } from '../_services/product-cart.service';
import { ProductCartItem } from '../_models/product-cart-item.model';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { FormsModule } from '@angular/forms';
import { PlaceholderFadeDirective } from '../_directives/placeholder-fade.directive';
import { RouterLink } from '@angular/router';
import { ScrollToTopDirective } from '../_directives/scroll-to-top.directive';

@Component({
  selector: 'app-product-cart',
  standalone: true,
  imports: [NgFor, AsyncPipe, FormsModule, PlaceholderFadeDirective, NgIf, RouterLink, ScrollToTopDirective],
  templateUrl: './product-cart.component.html',
  styleUrl: './product-cart.component.scss',
  animations: [
    trigger('animation', [
      transition('*<=>*', [
        query(':enter', [
          style({ opacity: 0, transform: 'scale(0.7)' }),
          animate('500ms ease-in', style({ opacity: 1, transform: 'scale(1)' }))
        ])
      ])
    ]),
    trigger('cartAnimation', [
      transition('* => *', [
        query('.cart-item', style({ transform: 'translateX(100%)', opacity: 0 }), { optional: true }),
        query('.cart-item', stagger('100ms', [
          animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
        ]), { optional: true })
      ])
    ])
  ]
})
export class ProductCartComponent implements OnInit {
  cartItems: ProductCartItem[] = [];
  templateImg = "https://kvadratsushi.com/wp-content/uploads/2024/04/piza_fiesta.jpg";
  constructor(public cartService: ProductCartService) { }
  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(
      data => this.cartItems = data
    );
  }
  @ViewChild("shoppingCart") shoppingCart!: ElementRef;
  @ViewChild("openCartButton") openCartButton!: ElementRef;
  @ViewChild("backdrop") backdrop!: ElementRef;
  @ViewChild("coupon") coupon!: ElementRef;

  openCart() {
    this.openCartButton.nativeElement.style.display = "none";
    this.shoppingCart.nativeElement.style.display = "block";
    this.backdrop.nativeElement.style.display = "block";
  }

  closeCart() {
    this.openCartButton.nativeElement.style.display = "block";
    this.shoppingCart.nativeElement.style.display = "none";
    this.backdrop.nativeElement.style.display = "none";
  }

  getOrderTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  increaseQuantity(foodItemId: number) {
    this.cartService.increaseQuantity(foodItemId);
  }

  decreaseQuantity(foodItemId: number) {
    this.cartService.decreaseQuantity(foodItemId);
  }

  toggleCoupon() {
    const couponElement = this.coupon.nativeElement;
    if (couponElement.style.maxHeight) {
      couponElement.style.maxHeight = null;
    } else {
      couponElement.style.maxHeight = couponElement.scrollHeight + 'px';
    }
  }

  getTotalItems() {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }
}
