import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShoppingCartService } from '../shopping-cart.service';
import { AuthService } from 'src/app/core/auth.service';
import { Product } from 'src/app/models/product.interface';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  checkoutItems: Product[] = [];
  totalBill: number = 0;
  userData: any;
  showOrderSuccess: boolean = false;

  constructor(
    private readonly cartService: ShoppingCartService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.checkoutItems = this.cartService.getShoppingItems();
    this.userData = this.authService.getUserData();
    this.totalBill = this.cartService.getTotalBill();
  }

  forwardOrder() {
    const simplifiedOrder: Object[] = [];
    this.checkoutItems.forEach((item) => {
      let newItem: any = {};
      newItem.id = item.id;
      newItem.amount = item.amount;
      simplifiedOrder.push(newItem);
    });
    this.authService.onPlaceOrder(simplifiedOrder, this.userData).subscribe((res) => {
      this.showOrderSuccess = true;
    });
  }

  activateLink() {
    this.showOrderSuccess = false;
    this.router.navigate(['/']);
    sessionStorage.removeItem('sumAmount');
    this.cartService.clearAmount();
  }
}
