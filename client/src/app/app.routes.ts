import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CooperationFranchiseComponent } from './cooperation-franchise/cooperation-franchise.component';
import { ProductsFilterComponent } from './products-filter/products-filter.component';
import { productCardResolver } from './_resolvers/product-card.resolver';
import { NewsComponent } from './news/news.component';
import { PromotionsComponent } from './promotions/promotions.component';
import { PaymentDeliveryComponent } from './payment-delivery/payment-delivery.component';
import { ContactsComponent } from './contacts/contacts.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { productDetailsResolver } from './_resolvers/product-details.resolver';

const categories = [
    "sushi-and-rols",
    "sushi-burgers",
    "sushi-sets",
    "burgers",
    "pizza",
    "soups",
    "salads",
    "snacks",
    "drinks",
    "applications"
];

const createCategoryRoutes = (categories: string[]): Routes => {
    return categories.map(category => ({
        path: category,
        component: ProductsFilterComponent,
        resolve: {
            productCards: productCardResolver
        }
    }));
};

const categoryRoutes = createCategoryRoutes(categories);

export const routes: Routes = [
    { path: "cooperation-franchise", component: CooperationFranchiseComponent },
    ...categoryRoutes,
    { path: "", component: HomeComponent },
    { path: "news", component: NewsComponent },
    { path: "promotions", component: PromotionsComponent },
    { path: "payment-and-delivery", component: PaymentDeliveryComponent },
    { path: "contacts", component: ContactsComponent },
    { path: "product/:id", component: ProductDetailsComponent, resolve: { productDetails: productDetailsResolver } },
];
