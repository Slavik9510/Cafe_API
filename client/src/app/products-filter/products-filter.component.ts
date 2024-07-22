import { Component, OnInit } from '@angular/core';
import { ProductsListComponent } from '../products-list/products-list.component';
import { ProductsService } from '../_services/products.service';
import { ActivatedRoute } from '@angular/router';
import { ProductCard } from '../_models/product-card.model';

@Component({
  selector: 'app-products-filter',
  standalone: true,
  imports: [ProductsListComponent],
  templateUrl: './products-filter.component.html',
  styleUrl: './products-filter.component.scss'
})
export class ProductsFilterComponent implements OnInit {
  products: ProductCard[] = [];
  constructor(private route: ActivatedRoute, private productsService: ProductsService) { }

  ngOnInit(): void {
    this.route.data.subscribe(
      data => {
        this.products = data['productCards'];
      }
    );
  }

  orderBy(event: any) {
    const orderBy = event.target.value;
    const category = this.route.snapshot.url[0].path;
    this.productsService.getItemsByCategory(category, orderBy).subscribe(
      data => {
        this.products = data;
      }
    )
  }
}
