import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { evironment } from 'src/environments/environment.development';
import { Product } from '../models/product.interface';
import { Observable, map } from 'rxjs';
import { ShoppingCartService } from './shopping-cart/shopping-cart.service';

@Injectable({
  providedIn: 'root',
})
export class ProductListService {
  private readonly backendURL = evironment.backendURL;
  cartFormProps: Pick<Product, 'title' | 'price'>;

  constructor(private readonly httpClient: HttpClient, private readonly cartService: ShoppingCartService) {}

  getAllProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.backendURL}/items`).pipe(
      map((response) => {
        return response.map((item) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          description: item.description,
          onStock: item.onStock,
          mainCategory: item.mainCategory,
          subCategory: item.subCategory,
          originCountry: item.originCountry,
          url: item.url,
          isNovelty: item.isNovelty,
          isDiscounted: item.isDiscounted,
        }));
      })
    );
  }

  getProductById(id: string) {
    return this.httpClient
      .get<any>(`${this.backendURL}/items`)
      .pipe(map((res) => res.find((data: Product) => data.id === id)));
  }

  getSuggestedProducts(mainCategory: string, title: string) {
    return this.httpClient
      .get<any>(`${this.backendURL}/items`)
      .pipe(
        map((response) =>
          response.filter((item: Product) => item.mainCategory === mainCategory && item.title !== title)
        )
      );
  }

  getCostFilter(productsList: Product[], sortBy: string): Product[] {
    const sortedProducts = [...productsList];
    if (sortBy === 'relevance') {
      const compare = (a: Product, b: Product) => {
        if (a.title < b.title) {
          return -1;
        }
        if (a.title > b.title) {
          return 1;
        }
        return 0;
      };
      return sortedProducts.sort(compare);
    } else {
      const compare = (a: Product, b: Product) => {
        return sortBy === 'increasing' ? a.price - b.price : b.price - a.price;
      };
      return sortedProducts.sort(compare);
    }
  }

  getAdvancedFilter(advancedParameters: any, filteredList: Product[]) {
    let filteredProducts = [...filteredList];

    if (advancedParameters.onStock != null) {
      filteredProducts = filteredProducts.filter((product) => product.onStock === advancedParameters.onStock);
    }

    if (advancedParameters.originCountry != null) {
      filteredProducts = filteredProducts.filter(
        (product) => product.originCountry === advancedParameters.originCountry
      );
    }

    if (advancedParameters.mainCategory != null) {
      filteredProducts = filteredProducts.filter((product) => product.mainCategory === advancedParameters.mainCategory);
    }

    if (advancedParameters.subCategory != null) {
      filteredProducts = filteredProducts.filter((product) => product.subCategory === advancedParameters.subCategory);
    }

    return filteredProducts;
  }

  getSearchedElements(filteredProducts: Product[], keyword: string) {
    return filteredProducts.filter((product: Product) => product.title.toLowerCase().includes(keyword.toLowerCase()));
  }

  addProductToCart(res: any) {
    let cartItems = JSON.parse(sessionStorage.getItem('cartItem') || '[]');
    const existingShoppingItem = cartItems.find((cartItem: Product) => cartItem.id === res.id);
    if (existingShoppingItem) {
      existingShoppingItem.amount = existingShoppingItem.amount + res.amount;
    } else {
      cartItems.push(res);
    }
    sessionStorage.setItem('cartItem', JSON.stringify(cartItems));
    this.cartService.amountDeterminator(res.amount);
  }
}
