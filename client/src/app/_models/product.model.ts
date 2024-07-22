export interface Product {
    id: number;
    title: string;
    category: string;
    ingredients: string;
    creationDate: Date;
    additionalInfo: { [key: string]: string };
    foodItems: FoodItem[];
}

export interface FoodItem {
    id: number;
    price: number;
    size?: number;
}
