import { CustomTableArgs } from "../../shared-module/custom-table/custom-table-model";
import { ITableField } from "./ITableField";
import { ConfirmDialog } from "../../shared-module/confirm-dialog/confirm-dialog.component";
import { MessageBar } from "../../common/tool/message-bar";
export class BusinessTable{
    dataSource :CustomTableArgs<ITableField>;    
    confirmDialog_:ConfirmDialog;    
    tableSelectIds:string[];
    msg = new MessageBar();
    set totalCount(val: number) {
        this.dataSource.footArgs.totalRecordCount = val;
    }

    set pageCount(val: number) {
        this.dataSource.footArgs.pageCount = val;
    }  

    setConfirmDialog(msg:string,okFn:()=>void){
        this.confirmDialog_ = new ConfirmDialog();
        this.confirmDialog_.cancelFn = ()=>{
             this.confirmDialog_=null;
        }
        this.confirmDialog_.content=msg;
        this.confirmDialog_.okFn =()=>{
            okFn();
        }
    }

    clearItems() {
        this.dataSource.values = [];
        this.dataSource.iconTextTagAttr = [];
        this.dataSource.footArgs.totalRecordCount = 0;
        this.dataSource.footArgs.pageCount=1;
    }
 
    delItems(ids: string[]) {
        for (const id of ids) {
            const index = this.dataSource.values.findIndex(x => x.id == id);
            if (index > -1)
                this.dataSource.values.splice(index, 1);
        }
        this.dataSource.footArgs.totalRecordCount -= ids.length;
    } 
}