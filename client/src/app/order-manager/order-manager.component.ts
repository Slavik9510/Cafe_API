import { Component, OnDestroy, OnInit } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { User } from '../_models/user.model';
import { environment } from '../../environments/environment';
import { AccountService } from '../_services/account.service';
import { OrderPending, OrderStatus } from '../_models/order-pending.model';
import { NgFor, NgIf } from '@angular/common';
import { EmployeeService } from '../_services/employee.service';

@Component({
  selector: 'app-order-manager',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './order-manager.component.html',
  styleUrl: './order-manager.component.scss'
})
export class OrderManagerComponent implements OnInit, OnDestroy {
  private hubUrl = environment.hubUrl;
  private hubConnection?: HubConnection;
  pendingOrders: OrderPending[] = [];

  constructor(private accountService: AccountService, private employeeService: EmployeeService) { }

  ngOnInit(): void {
    this.accountService.currentUser$.subscribe(user => {
      if (user)
        this.createHubConnection(user);
    }
    );
    this.employeeService.getPendingOrders().subscribe(data => {
      if (data) this.pendingOrders = data;
    });
  }

  ngOnDestroy(): void {
    this.stopHubConnection();
  }

  createHubConnection(user: User): void {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'orders', {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch(error => console.log(error));

    this.hubConnection.on("Receive", pendingOrder => {
      this.pendingOrders.push(pendingOrder);
    });

    this.hubConnection.on("OrderInProgress", orderId => {
      const order = this.pendingOrders.find(x => x.id == orderId);
      if (order === undefined) return;
      order.status = OrderStatus.InProgress;
    })
  }

  stopHubConnection(): void {
    this.hubConnection?.stop().catch(error => console.log(error));
  }

  getOrderTotal(order: OrderPending): number {
    return order.items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  processOrder(orderId: number): void {
    this.hubConnection?.invoke("ProcessOrder", orderId, OrderStatus.InProgress)
      .catch(err => console.error(err));
  }

  isInProgress(order: OrderPending): boolean {
    return order.status === OrderStatus.InProgress;
  }
}
