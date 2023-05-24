import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from './product-list.component';
import { ProductRoutingModule } from './product-list-routing.module';
import { ProductItemComponent } from './product-item/product-item.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { CheckoutComponent } from './shopping-cart/checkout/checkout.component';
import { LoaderModule } from '../shared/loader.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [ProductListComponent, ProductItemComponent, ShoppingCartComponent, CheckoutComponent],
  imports: [CommonModule, ProductRoutingModule, FormsModule, ReactiveFormsModule, LoaderModule, HttpClientModule],
  exports: [ProductListComponent, ShoppingCartComponent],
})
export class ProductListModule {}
