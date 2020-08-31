import { SearchHelper } from "../../common/tool/table-form-helper";
import { InputTagSelect } from "../../shared-module/input-tag-select/input-tag-select";
import { ResourceLabel } from "../../data-core/model/resource-label";
export class ResourceSearchControl<T extends ResourceSearchParam> extends SearchHelper{
   
    inputTagSelect = Array<InputTagSelect>();
    toInputTagSelect(list:ResourceLabel[]){
        for(const item of list)
            this.inputTagSelect.push(new InputTagSelect(item.Id,item.Name,false));        
    }

    toSearchParam(){
        const param =  this.searchform.value as T;
        param.AndLabelIds=new Array<string>();
        this.inputTagSelect.filter(x=>x.checked&&x.hide==false).map(c=>{
            param.AndLabelIds.push(c.id);
        });
        return param;
    }
}

export class ResourceSearchParam{
    AndLabelIds:string[];
}