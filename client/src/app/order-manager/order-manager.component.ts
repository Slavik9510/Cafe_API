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
  activeOrderId: number | undefined;
  readonly OrderStatus = OrderStatus;

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.accountService.currentUser$.subscribe(user => {
      if (user)
        this.createHubConnection(user);
    }
    );
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

    this.hubConnection.on("GetPendingOrders", orders => {
      if (orders) this.pendingOrders = orders;
    });

    this.hubConnection.on("NewOrderReceived", pendingOrder => {
      this.pendingOrders.push(pendingOrder);
    });

    this.hubConnection.on("OrderInProgress", orderId => {
      const order = this.pendingOrders.find(x => x.id == orderId);
      if (order === undefined) return;
      order.status = OrderStatus.InProgress;
    });

    this.hubConnection.on("ReleasedOrder", orderId => {
      const order = this.pendingOrders.find(x => x.id == orderId);
      if (order === undefined) return;
      order.status = OrderStatus.Pending;
    });

    this.hubConnection.on("OrderProcessed", orderId => {
      this.pendingOrders = this.pendingOrders.filter(x => x.id !== orderId);
    });
  }

  stopHubConnection(): void {
    this.hubConnection?.stop().catch(error => console.log(error));
  }

  getOrderTotal(order: OrderPending): number {
    return order.items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  processOrder(orderId: number, status: OrderStatus): void {
    if (status === OrderStatus.InProgress)
      this.activeOrderId = orderId;
    else this.activeOrderId = undefined;
    this.hubConnection?.invoke("ProcessOrder", orderId, status)
      .catch(err => console.error(err));
  }

  isActionsActive(order: OrderPending): boolean {
    return this.isProcessedByMe(order) || !this.isInProgress(order) && this.activeOrderId === undefined;
  }

  isInProgress(order: OrderPending): boolean {
    return order.status === OrderStatus.InProgress;
  }

  isProcessedByMe(order: OrderPending): boolean {
    return this.activeOrderId === order.id;
  }
}