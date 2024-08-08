import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Order } from '../_models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  placeOrder(order: Order) {
    console.log(order);
    return this.http.post(this.apiUrl + 'orders', order)
  }
}
