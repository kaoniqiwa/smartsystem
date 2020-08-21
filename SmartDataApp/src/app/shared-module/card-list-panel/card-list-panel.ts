import { HWPaginationOptions } from "../../common/directive/pagination-directive";

export class CardListPanel{
     barTitle:{ icon:AccessoryIcon,label:AccessoryIconLabel};
     barEqualAccessorys :{ icon:AccessoryIcon,label:AccessoryIconLabel}[]; 
     barOtherAccessorys :AccessoryIcon[]; 
     barBody:{id:string,label:string}[];
     id:string;
}

export class ViewPagination extends HWPaginationOptions{
    totalRecordCount:number=0;  
}

export class PanelView{
    pagination :ViewPagination;
    listPanel:CardListPanel[] = new Array();
    event:(type:EventTypeEnum,listId:string,itemId:string)=>void;
}

export class Accessory{
    colorClass:string;  
}
export class AccessoryIcon  extends Accessory{
    icon:string  
}

export class AccessoryIconLabel extends Accessory{
    label:string 
}
 
export enum EventTypeEnum{
    ListItemDel
}