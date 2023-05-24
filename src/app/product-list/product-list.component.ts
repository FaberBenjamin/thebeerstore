import { Component, OnInit } from '@angular/core';
import { ProductListService } from './product-list.service';
import { Product } from '../models/product.interface';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ShoppingCartService } from './shopping-cart/shopping-cart.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  animations: [
    trigger('addProductAnimation', [
      state('start', style({ transform: 'scale(1' })),
      state(
        'end',
        style({
          transform: 'scale(0.2',
          top: '0',
          right: '0',
          fontSize: '1px',
          opacity: '0',
        })
      ),
      transition('start => end', [
        animate('0.5s', style({ transform: 'scale(0.2) rotate(360deg) translate(100%, -100%)' })),
      ]),
      transition('end => start', [animate('0.1s')]),
    ]),
  ],
})
export class ProductListComponent implements OnInit {
  productsList: Product[] = [];
  filteredProducts: Product[] = [];

  originCountries: string[];
  mainCategories: string[];
  subCategories: string[];

  page = 1;
  pageSize = 8;

  advancedIsOpen: boolean = false;
  showAddForm: boolean = false;
  showAmountError: boolean = false;

  selectedProduct: Product;
  rangeSelect: any = 'relevance';

  animationState = 'start';

  constructor(private readonly productService: ProductListService, private readonly cartService: ShoppingCartService) {}

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe((res) => {
      this.productsList = res;
      this.filteredProducts = [...this.productsList];
      this.originCountries = Array.from(
        new Set(this.filteredProducts.map((product: Product) => product.originCountry))
      );
      this.mainCategories = Array.from(new Set(this.filteredProducts.map((product: Product) => product.mainCategory)));
    });
    this.advancedForm.controls.mainCategory.valueChanges.subscribe((mainCategory: any) => {
      let selectedCategory = mainCategory;
      let categoryFilteredProducts = this.productsList.filter(
        (product: Product) => product.mainCategory === selectedCategory
      );
      this.subCategories = Array.from(new Set(categoryFilteredProducts.map((product: Product) => product.subCategory)));
    });
  }

  get pages() {
    const pageCount = Math.ceil(this.filteredProducts.length / this.pageSize);
    const currentPageIndex = this.page - 1;
    const maxVisiblePages = 5;
    let start = Math.max(currentPageIndex - 2, 0);
    let end = Math.min(start + maxVisiblePages - 1, pageCount - 1);
    if (end - start < maxVisiblePages - 1) {
      start = Math.max(end - maxVisiblePages + 1, 0);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i + 1);
  }

  // Add Item to Cart Form

  onActivateCartForm(productId: string): void {
    this.selectedProduct = this.productsList.find((item: Product) => item.id === productId)!;
    this.showAddForm = true;
  }

  amountForm = new FormGroup({
    amount: new FormControl(1, {
      validators: [Validators.min(0), Validators.pattern('^[0-9]*$'), Validators.required],
    }),
  });

  handleBackStep() {
    this.showAddForm = false;
    this.showAmountError = false;
  }

  addProductToCart(id: string) {
    if (this.amountForm.controls['amount'].valid) {
      this.productService.getProductById(id).subscribe((res) => {
        res.amount = this.amountForm.controls.amount.value;
        this.productService.addProductToCart(res);
        this.amountForm.controls.amount.setValue(1);
        this.animationState = 'end';
        setTimeout(() => {
          this.showAddForm = false;
          this.animationState = 'start';
        }, 500);
      });
    } else {
      this.showAmountError = true;
    }
  }

  // Advanced search

  searchForm = new FormGroup({
    searchInput: new FormControl(''),
  });

  onSearch() {
    this.advancedForm.controls.mainCategory.setValue('any');
    this.advancedForm.controls.subCategory.setValue('any');
    this.advancedForm.controls.originCountry.setValue('any');
    this.advancedForm.controls.onStock.setValue(false);
    this.rangeSelect = 'relevance';
    this.filteredProducts = this.productService.getSearchedElements(
      [...this.productsList],
      this.searchForm.controls.searchInput.value!
    );
  }

  // Advanced Form

  toogleAdvancedMenu() {
    this.advancedIsOpen = !this.advancedIsOpen;
  }

  advancedForm = new FormGroup({
    mainCategory: new FormControl<string>('any'),
    subCategory: new FormControl<string>('any'),
    originCountry: new FormControl<string>('any'),
    onStock: new FormControl<boolean>(false),
  });

  handleSubcategory() {
    this.advancedForm.controls.subCategory.setValue('any');
  }

  onSubmit() {
    const advancedParameters: any = {};
    this.rangeSelect = 'relevance';
    this.searchForm.reset();

    if (this.advancedForm.get('mainCategory')?.value !== 'any') {
      advancedParameters.mainCategory = this.advancedForm.get('mainCategory')?.value;
    }

    if (this.advancedForm.get('originCountry')?.value !== 'any') {
      advancedParameters.originCountry = this.advancedForm.get('originCountry')?.value;
    }

    if (
      this.advancedForm.get('subCategory')?.value !== 'any' &&
      this.advancedForm.get('mainCategory')?.value !== 'any'
    ) {
      advancedParameters.subCategory = this.advancedForm.get('subCategory')?.value;
    }

    if (this.advancedForm.get('onStock')?.value !== false) {
      advancedParameters.onStock = this.advancedForm.get('onStock')?.value;
    }

    if (Object.keys(advancedParameters).length > 0) {
      this.filteredProducts = this.productService.getAdvancedFilter(advancedParameters, this.productsList);
      this.page = 1;
    } else {
      this.filteredProducts = [...this.productsList];
    }
  }

  onRangeFilter(e: any) {
    this.filteredProducts = this.productService.getCostFilter(this.filteredProducts, e.target.value)!;
  }
}
