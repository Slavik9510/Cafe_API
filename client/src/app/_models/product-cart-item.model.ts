export interface ProductCartItem {
    id: number;
    quantity: number;
    foodItemId: number;
    title: string;
    imgUrl: string | null;
    price: number;
}