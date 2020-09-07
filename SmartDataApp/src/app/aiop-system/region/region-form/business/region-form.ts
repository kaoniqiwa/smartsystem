import { Injectable } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { FormStateEnum} from "../../../../common/tool/table-form-helper";
import { Region } from "../../../../data-core/model/aiop/region";
import { MessageBar } from "../../../../common/tool/message-bar";
import { RegionRequestService } from "../../../../data-core/repuest/region.service"; 
@Injectable()
export class RegionFormService{
    form: FormGroup;
    editItem: Region;
    messageBar = new MessageBar();
    formState: FormStateEnum;
    constructor(private regionRequestService:RegionRequestService){
        this.form = new FormGroup({
            Name: new FormControl(''),
            Description: new FormControl('')
        });
    }

    resetForm(){
        this.form.patchValue({
            Name: '',
            Description: '', 
        });
    }

    async defaultForm(editItem: Region) {
       
        if (editItem) {
            this.editItem = editItem;
            this.form.patchValue({
                Name: editItem.Name,
                Description: editItem.Description, 
            });
            this.formState = FormStateEnum.edit;
        }
        else {
            this.formState = FormStateEnum.create;
        }
    }

    checkForm(item: FormField) {
        if (item.Name == '') {
            this.messageBar.response_warning('名称不能为空');
            return false;
        }
        return true;
    }

    async saveFrom(item: FormField, successFn: (success: boolean, item: Region, formState: FormStateEnum) => void) {
        const check = this.checkForm(item);
        var region: Region;
        region = (this.editItem && this.formState == FormStateEnum.edit) ? this.editItem : new Region();
        if (check) {  
            region.Description = item.Description
            region.Name=item.Name;      
            region.UpdateTime = new Date().toISOString();
            if (this.formState == FormStateEnum.create) {
                region.Id = '';
                region.IsLeaf= item.ParentId ? true : false;
                region.RegionType=item.ParentId=='' ? 1:2;
                region.ParentId = item.ParentId;
                region.CreateTime = new Date().toISOString();
                const response = await this.regionRequestService.create(region).toPromise();
                if (response.FaultCode == 0) { 
                    this.messageBar.response_success();
                    this.resetForm();
                    successFn(true, response.Data, this.formState);
                }
            }
            else if (this.formState == FormStateEnum.edit) {  
                const response = await this.regionRequestService.set(region).toPromise(); 
                if (response.FaultCode == 0) { 
                    // this.resetForm();
                    this.messageBar.response_success();
                    successFn(true, response.Data, this.formState);
                }
            }
        }
    }
}

export interface FormField {
    Name: string,
    Description: string; 
    ParentId: string;
    IsLeaf: boolean;
}