import { Component, OnDestroy, OnInit } from '@angular/core';
import { ShoppingCartService } from './shopping-cart.service';
import { Product } from 'src/app/models/product.interface';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss'],
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  shoppingCartItems: Product[] = [];
  totalBill: number = 0;

  constructor(private readonly cartService: ShoppingCartService) {}

  ngOnInit(): void {
    this.shoppingCartItems = this.cartService.getShoppingItems();
    this.totalBill = this.cartService.getTotalBill();
  }

  descreaseCartItemAmount(itemId: string, itemPrice: number) {
    this.shoppingCartItems = this.cartService.decreaseAmount(itemId);
    this.totalBill = this.totalBill - itemPrice;
  }

  increaseCartItemAmount(itemId: string, itemPrice: number) {
    this.shoppingCartItems = this.cartService.increaseAmount(itemId);
    this.totalBill = this.totalBill + Number(itemPrice);
  }

  getShoppingCartItems() {
    return this.shoppingCartItems;
  }

  ngOnDestroy(): void {
    this.totalBill = 0;
  }
}
