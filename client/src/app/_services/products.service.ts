import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ProductCard } from '../_models/product-card.model';
import { ProductDetails } from '../_models/product-details.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getItemsByCategory(category: string, orderBy: string = 'date-desc') {
    let categoryName: string;

    switch (category) {
      case 'sushi-and-rols':
        categoryName = 'Sushi and Rolls';
        break;
      case 'sushi-burgers':
        categoryName = 'Sushi burgers';
        break;
      case 'sushi-sets':
        categoryName = 'Asorti';
        break;
      case 'burgers':
        categoryName = 'Burgers';
        break;
      case 'pizza':
        categoryName = 'Pizza';
        break;
      case 'soups':
        categoryName = 'Soups';
        break;
      case 'salads':
        categoryName = 'Salads';
        break;
      case 'snacks':
        categoryName = 'Snacks';
        break;
      case 'drinks':
        categoryName = 'Drinks';
        break;
      case 'applications':
        categoryName = 'Applications';
        break;
      default:
        throw new Error("Unknown category");
    }

    let params = new HttpParams();
    params = params.append('category', categoryName);
    params = params.append('orderBy', orderBy);

    return this.http.get<ProductCard[]>(this.apiUrl + 'products', { params });
  }

  getPopularItems(quantity: number) {
    let params = new HttpParams()
      .set('quantity', quantity);
    return this.http.get<ProductCard[]>(this.apiUrl + 'products/popular', { params });
  }

  getProductDetailsById(id: number) {
    return this.http.get<ProductDetails>(this.apiUrl + 'products/' + id);
  }
}
