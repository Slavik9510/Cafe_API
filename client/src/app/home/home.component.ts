import { Component, OnInit } from '@angular/core';
import { HotDealsComponent } from '../hot-deals/hot-deals.component';
import { ProductsService } from '../_services/products.service';
import { ProductCard } from '../_models/product-card.model';
import { ProductsListComponent } from "../products-list/products-list.component";

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [HotDealsComponent, ProductsListComponent]
})
export class HomeComponent implements OnInit {
  products: ProductCard[] = [];

  constructor(private productsService: ProductsService) { };

  ngOnInit(): void {
    this.productsService.getPopularItems(12).subscribe(
      data => {
        this.products = data;
      }
    )
  }
}
