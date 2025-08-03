import { Routes } from '@angular/router';
import { Categories } from './categories/categories';
import { Products } from './products/products';

export const routes: Routes = [
  { path: 'categories', component: Categories },
  { path: 'products', component: Products },
  { path: '', redirectTo: '/categories', pathMatch: 'full' },
];
