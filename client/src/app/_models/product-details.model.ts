import { ProductNavigationCard } from "./product-navigation-card.model";
import { FoodItem } from "./product.model";

export interface ProductDetails {
    id: number;
    title: string;
    ingredients: string;
    creationDate: Date;
    weightVariations?: string;
    additionalInfo?: { [key: string]: string };
    foodItems: FoodItem[];
    neighbourItems: (ProductNavigationCard | null)[];
}