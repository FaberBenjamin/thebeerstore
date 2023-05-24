import { Component } from '@angular/core';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-cookie-consent',
  templateUrl: './cookie-consent.component.html',
  styleUrls: ['./cookie-consent.component.scss'],
})
export class CookieConsentComponent {
  hasConsent: boolean = localStorage.getItem('cookieConsent') === 'true';

  constructor(private readonly authService: AuthService) {}

  handleConsent() {
    this.authService.saveCoookieConsent();
    this.hasConsent = true;
  }
}
