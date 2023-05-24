import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from 'src/app/models/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  private sumAmountSubject = new BehaviorSubject<number>(0);
  sumAmount$ = this.sumAmountSubject.asObservable();
  totalBill: number = 0;

  constructor() {}

  amountDeterminator(amount: number) {
    const newValue = this.sumAmountSubject.value + amount;
    this.sumAmountSubject.next(newValue);
    sessionStorage.setItem('sumAmount', JSON.stringify(newValue));
  }

  clearAmount() {
    sessionStorage.removeItem('cartItem');
    this.sumAmountSubject.next(0);
  }

  getShoppingItems() {
    return JSON.parse(sessionStorage.getItem('cartItem') || '[]');
  }

  decreaseAmount(itemId: string) {
    let cartItems = JSON.parse(sessionStorage.getItem('cartItem') || '[]');
    const itemIndex = cartItems.findIndex((item: any) => item.id === itemId);
    if (itemIndex > -1 && cartItems[itemIndex].amount !== 1) {
      cartItems[itemIndex].amount--;
      sessionStorage.setItem('cartItem', JSON.stringify(cartItems));
      this.amountDeterminator(-1);
      return cartItems;
    } else {
      if (itemIndex === 0) {
        cartItems.shift();
        sessionStorage.setItem('cartItem', JSON.stringify(cartItems));
        return cartItems;
      }
      let tempFirstPart = cartItems.splice(0, itemIndex);
      let tempLastPart = cartItems.splice(itemIndex, cartItems.length);
      cartItems = tempFirstPart.concat(tempLastPart);
      sessionStorage.setItem('cartItem', JSON.stringify(cartItems));
      return cartItems;
    }
  }

  increaseAmount(itemId: string) {
    let cartItems = JSON.parse(sessionStorage.getItem('cartItem') || '[]');
    const itemIndex = cartItems.findIndex((item: any) => item.id === itemId);
    if (itemIndex > -1 && cartItems[itemIndex].amount > 0) {
      cartItems[itemIndex].amount++;
      sessionStorage.setItem('cartItem', JSON.stringify(cartItems));
      this.amountDeterminator(1);
      return cartItems;
    }
  }

  getTotalBill() {
    this.totalBill = 0;
    let cartItems = JSON.parse(sessionStorage.getItem('cartItem') || '[]');
    cartItems.forEach((item: Product) => {
      this.totalBill = this.totalBill + item.amount! * item.price;
    });
    return this.totalBill;
  }

  restorePrevState() {
    const storedSumAmount = sessionStorage.getItem('sumAmount');
    if (storedSumAmount) {
      this.sumAmountSubject.next(JSON.parse(storedSumAmount));
    }
  }
}
