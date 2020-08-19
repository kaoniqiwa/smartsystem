import { CustomTableEvent } from "../../shared-module/custom-table/custom-table-event";


export interface IPageTable<T extends ITableItem>{  
    addItem(item:T):void;
    editItem(item:T):void; 
    delItemFn:(id:string)=>void;
    updateItemFn: (item: T) => void;
    addItemFn: (item: T) => void; 
    scrollPageFn: (event: CustomTableEvent) => void;
    findItemFn: (id: string) => T;
}
 


export interface ITableItem{

}