import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./landing/landing.module').then((m) => m.LandingModule),
  },
  {
    path: 'products',
    loadChildren: () => import('./product-list/product-list.module').then((m) => m.ProductListModule),
  },
  {
    path: 'products/:id',
    loadChildren: () => import('./product-detail/product-detail.module').then((m) => m.ProductDetailModule),
  },
  {
    path: 'products/shopping-cart',
    loadChildren: () => import('./product-list/product-list.module').then((m) => m.ProductListModule),
  },
  {
    path: 'registration',
    loadChildren: () => import('./registration/registration.module').then((m) => m.RegistrationModule),
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then((m) => m.LoginModule),
  },

  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
