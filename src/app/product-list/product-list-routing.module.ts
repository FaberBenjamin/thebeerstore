import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './product-list.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { ShoppingCartGuard } from './shopping-cart/shopping-cart.guard';
import { CheckoutComponent } from './shopping-cart/checkout/checkout.component';

const routes: Routes = [
  {
    path: '',
    component: ProductListComponent,
  },
  {
    path: 'shopping-cart',
    component: ShoppingCartComponent,
    canActivate: [ShoppingCartGuard],
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [ShoppingCartGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductRoutingModule {}
