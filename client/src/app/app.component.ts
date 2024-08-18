import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavComponent } from './nav/nav.component';
import { TopPanelComponent } from './top-panel/top-panel.component';
import { HotDealsComponent } from './hot-deals/hot-deals.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ProductCartComponent } from "./product-cart/product-cart.component";
import { ProductCartService } from './_services/product-cart.service';
import { ProductCartItem } from './_models/product-cart-item.model';
import { CommonModule } from '@angular/common';
import { BottomPanelComponent } from './bottom-panel/bottom-panel.component';
import { AccountService } from './_services/account.service';
import { User } from './_models/user.model';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    RouterOutlet,
    NavComponent,
    TopPanelComponent,
    HotDealsComponent,
    HomeComponent,
    FooterComponent,
    NgxSpinnerModule,
    ProductCartComponent,
    CommonModule,
    BottomPanelComponent
  ]
})
export class AppComponent implements OnInit {
  title = 'Cafe';

  constructor(private cartService: ProductCartService, private accountService: AccountService, private router: Router) { }

  ngOnInit(): void {
    this.setCartItems();
    this.setCurrentUser();
  }

  setCartItems() {
    const itemsString = localStorage.getItem('cartItems');
    if (!itemsString) return;

    const items: ProductCartItem[] = JSON.parse(itemsString);

    items.forEach(x => this.cartService.addToCart(x));
  }

  setCurrentUser() {
    const userString = localStorage.getItem('user');
    if (!userString) return;

    const user: User = JSON.parse(userString);
    this.accountService.setCurrentUser(user);
  }

  isCheckoutOpen(): boolean {
    return this.router.url === '/checkout';
  }
}
