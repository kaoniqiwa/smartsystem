import { EnumHelper } from "../../../common/tool/enum-helper";
import { CustomTableArgs, TableAttr, TableOperationBtn, TableIconTextTagAttr, TableTh } from "../../../shared-module/custom-table/custom-table-model";
import { Labels } from "./label";
import { ITableField } from "./ITableField";
import { ResourceLabel } from "../../../data-core/model/resource-label";
import { CustomTableEvent } from "../../../shared-module/custom-table/custom-table-event";
import { ConfirmDialog } from "../../../shared-module/confirm-dialog/confirm-dialog.component";

export class ResourcesTable extends EnumHelper {
    dataSource :CustomTableArgs<ITableField>;
    labels = new Labels();
    scrollPageFn: (event: CustomTableEvent) => void;
    attrBtnFn: () => void;
    confirmDialog_:ConfirmDialog;
    // showConfirm = false;
    tableSelectIds:string[];
    set totalCount(val: number) {
        this.dataSource.footArgs.totalRecordCount = val;
    }

    get maxPageIndex() {
        return !(this.dataSource.footArgs.totalRecordCount == this.dataSource.values.length);
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
    }
 
    delItems(ids: string[]) {
        for (const id of ids) {
            const index = this.dataSource.values.findIndex(x => x.id == id);
            if (index > -1)
                this.dataSource.values.splice(index, 1);
        }
        this.dataSource.footArgs.totalRecordCount -= ids.length;
    }

    updateItemLabels(add: boolean, devId: string, label: ResourceLabel) {
        const index = this.dataSource.iconTextTagAttr.findIndex(i => i.key == devId);
        if (add && index > -1) {
            this.dataSource.iconTextTagAttr[index].texts.push({ id: label.Id, label: label.Name });
        }
        else if (add == false && index > -1) {
            const lIndex = this.dataSource.iconTextTagAttr[index].texts.findIndex(x => x.id == label.Id);
            if (lIndex > -1) this.dataSource.iconTextTagAttr[index].texts.splice(lIndex, 1);
        }
    }
}
