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
    CommonModule
  ]
})
export class AppComponent implements OnInit {
  title = 'Cafe';

  constructor(private cartService: ProductCartService, private router: Router) { }

  ngOnInit(): void {
    this.setCartItems();
  }

  setCartItems() {
    const itemsString = localStorage.getItem('cartItems');
    if (!itemsString) return;

    const items: ProductCartItem[] = JSON.parse(itemsString);

    items.forEach(x => this.cartService.addToCart(x));
  }

  checkoutOpen(): boolean {
    return this.router.url === '/checkout';
  }
}
