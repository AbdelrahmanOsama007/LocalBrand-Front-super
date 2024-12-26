import { IGridData } from "./IGridData";

export interface IGridOperationResult{
    success: boolean;
    message: string;
    developMessage: string;
    data: IGridData;
}