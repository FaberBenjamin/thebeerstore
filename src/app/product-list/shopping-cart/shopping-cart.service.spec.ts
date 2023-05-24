import { TestBed } from '@angular/core/testing';

import { ShoppingCartService } from './shopping-cart.service';

describe('ShoppingCartService', () => {
  let service: ShoppingCartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShoppingCartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should calculate according to amount and price', () => {
    let CartItems = [
      {amount: 1, price: 1099},
      {amount: 20, price: 99},
      {amount: 5, price: 599}
    ]

    sessionStorage.setItem('cartItem', JSON.stringify(CartItems));
    let totalBill = service.getTotalBill();
    expect(totalBill).toBe(6074)
  })
});
