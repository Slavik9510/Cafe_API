import { ResolveFn } from '@angular/router';
import { ProductDetails } from '../_models/product-details.model';
import { inject } from '@angular/core';
import { ProductsService } from '../_services/products.service';

export const productDetailsResolver: ResolveFn<ProductDetails> = (route, state) => {
  const id = route.paramMap.get('id');
  const productService = inject(ProductsService);
  return productService.getProductDetailsById(Number(id));
};
