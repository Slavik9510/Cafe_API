import { Component, OnInit } from '@angular/core';
import { ProductCard } from '../_models/product-card.model';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [
    NgFor,
    NgIf],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss'
})
export class ProductsListComponent implements OnInit {
  products: ProductCard[] = [];

  selectedVariant: string = '';

  selectVariant(variant: string): void {
    this.selectedVariant = variant;
  }

  ngOnInit(): void {
    for (let i = 0; i < 1; i++) {
      const product: ProductCard = {
        id: i + 1,
        imageUrl: 'https://kvadratsushi.com/wp-content/uploads/2024/04/pizza_halapenio.jpg',
        title: 'Delicious Pizza',
        weightVariations: '110г',
        ingredients: 'Tomatoes, Cheese, Pepperoni',
        priceVariations: { 1: 10.99 }
      };
      this.products.push(product);
    }
  }

  hasMultipleVariations(product: ProductCard): boolean {
    return Object.keys(product.priceVariations).length > 0;
  }
}
