
import { IBusinessData } from "../../../../../common/interface/IBusiness";
import { EventTypeEnum } from '../../../../../common/tool/enum-helper';
export class EventDropOrderInfo implements IBusinessData {
    items:EventDropInfo[];
    dropList:Array<{id:string,name:string}>;
    defaultId:string;
    eventType:EventTypeEnum;
}

export class EventDropInfo{
    division:string;
    dropNum:number;
    unit:string;
}
