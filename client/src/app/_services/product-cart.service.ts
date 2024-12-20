import { Injectable } from "@angular/core";
import { ProductCartItem } from "../_models/product-cart-item.model";
import { BehaviorSubject, map, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProductCartService {
  private cartItemsSubject = new BehaviorSubject<ProductCartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  addToCart(item: ProductCartItem): void {
    const currentItems = this.cartItemsSubject.value;
    const existingItem = currentItems.find(x => x.foodItemId === item.foodItemId);

    if (existingItem === undefined) {
      this.cartItemsSubject.next([...currentItems, item]);
    } else {
      const updatedItems = currentItems.map(cartItem => {
        if (cartItem.foodItemId === item.foodItemId) {
          const newQuantity = cartItem.quantity + item.quantity;
          return {
            ...cartItem,
            quantity: newQuantity >= 10 ? 9 : newQuantity
          };
        }
        return cartItem;
      });
      this.cartItemsSubject.next(updatedItems);
    }
    localStorage.setItem('cartItems', JSON.stringify(this.cartItemsSubject.value));
  }

  removeItemFromCart(itemId: number): void {
    const currentItems = this.cartItemsSubject.value;
    const updatedItems = currentItems.filter(item => item.foodItemId !== itemId);
    this.cartItemsSubject.next(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(this.cartItemsSubject.value));
  }

  clearCart() {
    this.cartItemsSubject.next([]);
    localStorage.setItem('cartItems', JSON.stringify(this.cartItemsSubject.value));
  }

  increaseQuantity(itemId: number): void {
    const currentItems = this.cartItemsSubject.value;
    const updatedItems = currentItems.map(item => {
      if (item.foodItemId === itemId) {
        const newQuantity = item.quantity + 1;
        return { ...item, quantity: newQuantity >= 10 ? 9 : newQuantity };
      }
      return item;
    });
    this.cartItemsSubject.next(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(this.cartItemsSubject.value));
  }

  decreaseQuantity(itemId: number): void {
    const currentItems = this.cartItemsSubject.value;
    const updatedItems = currentItems.map(item => {
      if (item.foodItemId === itemId && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    })
      .filter(item => item.quantity > 0);;
    this.cartItemsSubject.next(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(this.cartItemsSubject.value));
  }

  getOrderTotal(): Observable<number> {
    return this.cartItems$.pipe(
      map(items => items.reduce((total, item) => total + item.price, 0))
    );
  }
}
