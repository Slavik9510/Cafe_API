export interface ProductCard {
    id: number;
    imageUrl: string;
    title: string;
    weightVariations: string;
    ingredients: string;
    priceVariations: { [key: number]: number };
}