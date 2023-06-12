import { Component, OnInit } from '@angular/core';
import { Product } from '../models/product.interface';
import { ProductListService } from '../product-list/product-list.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminService } from './admin.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  productsList: Product[] = [];
  filteredProducts: Product[] = [];

  productToModify: Product;

  productModifyToogle: boolean = false;
  addNewProductToogle: boolean = false;
  deleteProductToogle: boolean = false;
  itemToDeleteID: string;

  constructor(
    private readonly productListService: ProductListService,
    private readonly adminService: AdminService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.productListService.getAllProducts().subscribe((res) => {
      this.productsList = res;
      this.filteredProducts = [...this.productsList];
    });
  }

  searchForm = new FormGroup({
    searchInput: new FormControl(''),
  });

  modificationForm = new FormGroup<any>({
    imgUrl: new FormControl<string | null>(null),
    title: new FormControl<string | null>(null),
    price: new FormControl<number | null>(null),
    description: new FormControl<string | null>(null),
    mainCategory: new FormControl<string | null>(null),
    subCategory: new FormControl<string | null>(null),
    originCountry: new FormControl<string | null>(null),
    onStock: new FormControl<boolean | null>(true),
    isDiscounted: new FormControl<boolean | null>(true),
  });

  addProductForm = new FormGroup({
    title: new FormControl('', { validators: Validators.required }),
    price: new FormControl(1, { validators: Validators.required }),
    description: new FormControl('', { validators: Validators.required }),
    maincategory: new FormControl('', { validators: Validators.required }),
    subcategory: new FormControl('', { validators: Validators.required }),
    origincountry: new FormControl('', { validators: Validators.required }),
    url: new FormControl('', { validators: Validators.required }),
    onstock: new FormControl("true"),
    isnovelty: new FormControl("false"),
  });

  onSearch() {
    this.filteredProducts = this.productListService.getSearchedElements(
      [...this.productsList],
      this.searchForm.controls.searchInput.value!
    );
  }

  onAddActivator() {
    this.addNewProductToogle = true;
    this.productModifyToogle = false;
  }

  onDeleteActivator(id: string) {
    this.deleteProductToogle = true;
    this.itemToDeleteID = id;
  }

  deleteProduct() {
    this.adminService.onDeleteProduct(this.itemToDeleteID).subscribe(() => {
      this.location.go(this.location.path());
      window.location.reload();
    });
  }

  onModify(id: string) {
    this.productListService.getProductById(id).subscribe((product) => {
      this.productToModify = product;
    });
    this.addNewProductToogle = false;
    this.productModifyToogle = true;
  }

  onAddProduct() {
    if (this.addProductForm.valid) {
      let newProduct: Omit<Product, 'id'> = {
        title: this.addProductForm.controls.title
          .value!.charAt(0)
          .toUpperCase()
          .concat(this.addProductForm.controls.title.value!.slice(1)),
        price: this.addProductForm.controls.price.value!,
        description: this.addProductForm.controls.description
          .value!.charAt(0)
          .toUpperCase()
          .concat(this.addProductForm.controls.description.value!.slice(1)),
        mainCategory: this.addProductForm.controls.maincategory
          .value!.charAt(0)
          .toUpperCase()
          .concat(this.addProductForm.controls.maincategory.value!.slice(1)),
        subCategory: this.addProductForm.controls.subcategory
          .value!.charAt(0)
          .toUpperCase()
          .concat(this.addProductForm.controls.subcategory.value!.slice(1)),
        originCountry: this.addProductForm.controls.origincountry
          .value!.charAt(0)
          .toUpperCase()
          .concat(this.addProductForm.controls.origincountry.value!.slice(1)),
        url: this.addProductForm.controls.url.value!,
        onStock: this.addProductForm.controls.onstock.value! === "false" ? false : true,
        isNovelty: this.addProductForm.controls.isnovelty.value! === "false" ? false : true,
      };
      this.adminService.onAddProduct(newProduct).subscribe(() => {
        this.location.go(this.location.path());
        window.location.reload();
      });
    }
  }

  onModifyProduct() {
    let modifiedProduct: any = { ...this.productToModify };

    for (let property in this.modificationForm.controls) {
      if (this.modificationForm.controls.hasOwnProperty(property)) {
        let formControlValue = this.modificationForm.controls[property].value!;

        let propertyName = property as keyof Product;

        if (formControlValue !== null && typeof formControlValue === 'string' && formControlValue !== "false" && formControlValue !== "true") {
          formControlValue = formControlValue.slice(0, 1).toUpperCase().concat(formControlValue.slice(1));
          modifiedProduct[propertyName] = formControlValue;
        } else if (formControlValue !== null) {
         formControlValue === "false" ? modifiedProduct[propertyName] = false : modifiedProduct[propertyName] = true
        }
      }
    }

    this.adminService.onModifyServer(modifiedProduct).subscribe(() => {
      this.location.go(this.location.path());
      window.location.reload();
    });
  }
}
