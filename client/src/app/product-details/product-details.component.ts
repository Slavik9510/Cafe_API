import { Component, OnInit } from '@angular/core';
import { ProductDetails } from '../_models/product-details.model';
import { ProductsService } from '../_services/products.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
  animations: [
    trigger('blink', [
      state('true',
        style({ opacity: 1 })
      ),
      state('false',
        style({ opacity: 0 })
      ),
      transition('true => false', [
        animate(150)
      ]),
      transition('false => true', [
        animate(150)
      ])
    ])
  ]
})
export class ProductDetailsComponent implements OnInit {
  product!: ProductDetails;
  itemQuantity: number = 1;
  additionalInfoKeys: string[] = [];
  selectedVariant: number | undefined;
  priceFade: boolean = false;
  currentPrice!: number;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.data.subscribe(
      data => {
        this.product = data['productDetails'];
        this.additionalInfoKeys = this.product.additionalInfo ? Object.keys(this.product.additionalInfo) : [];
        this.selectedVariant = this.product.foodItems.at(0)?.id;
        this.currentPrice = this.getSelectedPrice();
      }
    );
  }

  hasMultipleVariations(): boolean {
    return this.product.foodItems.length > 1;
  }

  selectVariant(variant: number | undefined) {
    if (variant !== undefined && variant !== this.selectedVariant)
      this.priceFade = false;

    this.selectedVariant = variant;
  }

  decreaseQuantity() {
    if (this.itemQuantity > 1)
      this.itemQuantity--;
  }

  increaseQuantity() {
    if (this.itemQuantity < 10)
      this.itemQuantity++;
  }

  getSelectedPrice(): number {
    if (this.selectedVariant !== undefined) {
      return this.product.foodItems.find(item => item.id === this.selectedVariant)!.price;
    }

    return this.product.foodItems[0].price;
  }

  resetPrice() {
    this.currentPrice = this.getSelectedPrice();
    this.priceFade = true;
  }
}
