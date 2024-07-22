import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ProductsService } from '../_services/products.service';
import { ProductCard } from '../_models/product-card.model';

export const productCardResolver: ResolveFn<ProductCard[]> = (route, state) => {
  const category = route.url[0].path;
  const productsService = inject(ProductsService);
  return productsService.getItemsByCategory(category);
};
