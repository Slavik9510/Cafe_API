import { FoodItem } from "./product.model";

export interface ProductCard {
    id: number;
    title: string;
    weightVariations: string | undefined;
    ingredients: string;
    creationDate: Date;
    foodItems: FoodItem[];
}