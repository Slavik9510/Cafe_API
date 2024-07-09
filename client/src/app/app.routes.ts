import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CooperationFranchiseComponent } from './cooperation-franchise/cooperation-franchise.component';
import { ProductsListComponent } from './products-list/products-list.component';

export const routes: Routes = [
    { path: "cooperation-franchise", component: CooperationFranchiseComponent },
    { path: "pizza", component: ProductsListComponent },
    { path: "", component: HomeComponent },
];
