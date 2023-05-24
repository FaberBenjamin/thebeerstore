import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { evironment } from 'src/environments/environment.development';
import jwtDecode from 'jwt-decode';
import { ShoppingCartService } from '../product-list/shopping-cart/shopping-cart.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly backendURL = evironment.backendURL;

  private logValueHeaderSubject = new BehaviorSubject<boolean>(this.cookieService.check('token'));
  isLoggedIn$ = this.logValueHeaderSubject.asObservable();

  private usernameSubject = new BehaviorSubject<string>('');
  username$ = this.usernameSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly cookieService: CookieService,
    private readonly cartService: ShoppingCartService,
    private readonly router: Router
  ) {
    let token = this.cookieService.get('token');
    if (token) {
      let decoded: any = jwtDecode(token);
      this.usernameSubject.next(decoded.username);
    }
  }

  saveCoookieConsent() {
    localStorage.setItem('cookieConsent', 'true');
  }

  registration(
    username: string,
    email: string,
    password: string,
    fullName: string,
    city: string,
    postcode: string,
    adress: string
  ): Observable<any> {
    return this.http.post(`${this.backendURL}/registration`, {
      username,
      email,
      password,
      fullName,
      city,
      postcode,
      adress,
    });
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.backendURL}/login`, {
      email,
      password,
    });
  }

  handleLogin(token: any) {
    this.cookieService.set('token', token, new Date('2100'));
    this.updateHeader(true);
    let tokentemp = this.cookieService.get('token');
    let decoded: any = jwtDecode(tokentemp);
    this.updateUsername(decoded.username);
  }

  checkLogin() {
    return this.cookieService.check('token');
  }

  logout() {
    this.cookieService.delete('token');
    if (this.cookieService.check('token') === false) {
      this.cartService.clearAmount();
      this.cookieService.delete('username');
      sessionStorage.removeItem('sumAmount');
      this.usernameSubject.next('');
      this.router.navigate(['/']);
    }
  }

  checkAdmin() {
    let token = this.cookieService.get('token');
    let decoded: any = jwtDecode(token);
    if (decoded.role === 'admin') {
      return true;
    } else {
      return false;
    }
  }

  getUserData() {
    let token = this.cookieService.get('token');
    let decoded: any = jwtDecode(token);
    const user = {
      fullname: decoded.fullName,
      email: decoded.email,
      zipcode: decoded.postcode,
      city: decoded.city,
      adress: decoded.adress,
    };
    return user;
  }

  onPlaceOrder(orderItems: Object[], userData: object) {
    const order = Object.assign({}, userData, { products: orderItems });
    return this.http.post(`${this.backendURL}/orders`, { order });
  }

  // headerSpecific update

  updateHeader(isLoggedIn: boolean) {
    this.logValueHeaderSubject.next(isLoggedIn);
  }

  updateUsername(username: string) {
    this.usernameSubject.next(username);
    this.cookieService.set('username', username, new Date('2100'));
  }

  // headerSpecific update end
}
