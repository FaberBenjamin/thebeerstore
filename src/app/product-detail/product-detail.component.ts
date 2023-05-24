import { Component, OnInit } from '@angular/core';
import { ProductListService } from '../product-list/product-list.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../models/product.interface';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
  private id: string;
  description: string;
  onStock: boolean;
  originCountry: string;
  url: string;
  mainCategory: string;
  subCategory: string;
  price: number;
  title: string;

  page: number = 1;
  pageSize: number = 3;

  suggestedProducts: Product[] = [];

  constructor(
    private readonly productListService: ProductListService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    window.screen.width < 601 ? (this.pageSize = 1) : (this.pageSize = 3);

    this.activatedRoute.paramMap.subscribe((params) => {
      this.id = params.get('id')!;
      this.productListService.getProductById(this.id).subscribe((res: Product) => {
        (this.description = res.description),
          (this.onStock = res.onStock),
          (this.originCountry = res.originCountry),
          (this.url = res.url),
          (this.mainCategory = res.mainCategory),
          (this.subCategory = res.subCategory),
          (this.title = res.title),
          (this.price = res.price);

        if (this.mainCategory !== undefined) {
          this.productListService.getSuggestedProducts(this.mainCategory, this.title).subscribe((res) => {
            this.suggestedProducts = res;
          });
        }
      });
    });
  }

  redirectToSuggestedProduct(id: string) {
    this.router.navigate(['/products', id]);
  }
}
