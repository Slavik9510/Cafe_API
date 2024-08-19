export interface OrderPending {
    id: number;
    customerName: string;
    phoneNumber: string;
    email: string;
    additionalInfo: string;
    status: OrderStatus;
    items: OrderPendingItem[];
    creationTime: Date;
}

export enum OrderStatus {
    Pending = 0,
    Approved = 1,
    Rejected = 2,
    InProgress = 3
}

export interface OrderPendingItem {
    foodTitle: string;
    foodSize?: number;
    quantity: number;
    price: number;
}