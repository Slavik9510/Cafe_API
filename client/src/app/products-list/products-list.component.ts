import { Component, Input } from '@angular/core';
import { ProductCard } from '../_models/product-card.model';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ScrollToTopDirective } from '../_directives/scroll-to-top.directive';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [
    ProductCardComponent,
    CommonModule,
    RouterLink,
    ScrollToTopDirective
  ],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss'
})
export class ProductsListComponent {
  @Input({ required: true }) products!: ProductCard[];
  @Input() gapSize: string = '10px';
  @Input() columns: 3 | 4 = 3;
}
