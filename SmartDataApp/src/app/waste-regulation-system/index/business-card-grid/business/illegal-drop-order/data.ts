
import { IBusinessData } from "../../../../../common/interface/IBusiness";
export class IllegalDropOrderInfo implements IBusinessData {
    items:IllegalDropInfo[];
}

export class IllegalDropInfo{
    division:string;
    dropNum:number;
    unit:string;
}
