import {Product} from './product.interface'

export interface Discounted extends Product  {
    isDiscounted: boolean;
}