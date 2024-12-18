export interface ICartProducts{
    productId: number;
    productName: string;
    image: string;
    quantity: number;
    colorCode: string;
    size: string;
    priceBeforeDiscount: number;
    discount: number;
    priceAfterDiscount: number;
    sizeId: number;
    colorId: number;
}