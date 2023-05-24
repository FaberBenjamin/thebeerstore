export interface Product {
    id: string;
    title: string;
    price: number;
    originCountry: string;
    description: string;
    mainCategory: string;
    subCategory: string;
    onStock: boolean;
    url: string;
    amount?: number;
    isNovelty?: boolean;
    isDiscounted?: boolean;
}