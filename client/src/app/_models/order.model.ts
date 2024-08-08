export interface OrderItem {
    foodItemId: number;
    quantity: number;
}

export interface Order {
    customerName: string;
    phoneNumber: string;
    email: string | null;
    additionalInfo?: string | null;
    items: OrderItem[];
}
