import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductListService } from '../product-list.service';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'],
})
export class ProductItemComponent {
  showBlockPortal: boolean = false;

  constructor(private readonly authService: AuthService) {}

  @Input()
  title: string;
  @Input()
  description: string;
  @Input()
  price: number;
  @Input()
  originCountry: string;
  @Input()
  mainCategory: string;
  @Input()
  subCategory: string;
  @Input()
  onStock: boolean;
  @Input()
  url: string;
  @Input()
  id: string;
  @Input()
  isNovelty?: boolean;
  @Input()
  isDiscounted?: boolean;

  @Output()
  activateCart = new EventEmitter<void>();

  onActivateCart(): void {
    this.authService.checkLogin() ? this.activateCart.emit() : (this.showBlockPortal = true);
  }
}
