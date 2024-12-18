import { IOrderInfo } from "./IOrderInfo";

export interface IOperationResult{
    success: boolean;
    message: string;
    developMessage: string;
    data: object;
    additionalData: number;
    orderAdditionalData: IOrderInfo;
    onlinePaymentStatus: boolean;
    quantityLeek: boolean;
}