
import { Labels } from "./label"; 
import { ResourceLabel } from "../../data-core/model/resource-label";
import { ConfirmDialog } from "../../shared-module/confirm-dialog/confirm-dialog.component";
import { FormGroup } from "@angular/forms";
import {BusinessTable  } from "./business-table";
export class ResourcesTable extends BusinessTable {   
    searchform: FormGroup;
    //labels = new Labels(); 
    attrBtnFn: () => void;
    confirmDialog_:ConfirmDialog;     
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
