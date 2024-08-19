import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { OrderPending } from '../_models/order-pending.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getPendingOrders(): Observable<OrderPending[]> {
    return this.http.get<OrderPending[]>(this.apiUrl + 'employee/pending-orders');
  }
}