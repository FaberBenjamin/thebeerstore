import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ShoppingCartService } from '../product-list/shopping-cart/shopping-cart.service';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isUserLoggedIn: boolean;
  isUserAdmin: boolean = false;
  isNavbarCollapsed: boolean = false;
  showBlockPortal: Boolean = false;
  username: string;

  constructor(
    private readonly router: Router,
    public cartService: ShoppingCartService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cartService.restorePrevState();
    this.authService.isLoggedIn$.subscribe((val) => {
      this.isUserLoggedIn = val;
      if (val === true) {
        this.isUserAdmin = this.authService.checkAdmin();
      }
    });
    this.authService.username$.subscribe((username) => {
      this.username = username;
    });
    window.screen.width <= 600 ? (this.isNavbarCollapsed = true) : (this.isNavbarCollapsed = false);
  }

  collapseNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  navToSpecialty() {
    this.router.navigate(['/home'], { fragment: 'specialOffers' });
  }

  navToContact() {
    this.router.navigate(['/home'], { fragment: 'contact' });
  }

  handleLogout() {
    this.authService.logout();
    this.authService.updateHeader(false);
    this.router.navigate(['/']);
  }

  navigateToCart() {
    if (this.authService.checkLogin() === true) {
      this.router.navigate(['/products/shopping-cart']);
    } else {
      this.showBlockPortal = true;
    }
  }
}
