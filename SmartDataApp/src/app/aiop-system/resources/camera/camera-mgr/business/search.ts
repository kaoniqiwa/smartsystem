import { FormGroup ,FormControl} from "@angular/forms"; 
import { InputTagSelect } from "../../../../../shared-module/input-tag-select/input-tag-select";
import { ResourceLabel } from "../../../../../data-core/model/resource-label";

import { SearchHelper } from "../../../../../common/tool/table-form-helper";
export class SearchControl extends SearchHelper{
    searchform: FormGroup;
 
    inputTagSelect = Array<InputTagSelect>();
 
    constructor(){
        super();
        this.searchform = new FormGroup({
            Name: new FormControl(''), 
            EncodeDeviceId: new FormControl(''), 
            CameraType: new FormControl(''),
            SearchText: new FormControl('')
        });
    }

    clearState(){
        this.state=false;
        this.searchform.patchValue({
            SearchText:'',
            Name:''
        });
    }

    toInputTagSelect(list:ResourceLabel[]){
        for(const item of list)
            this.inputTagSelect.push(new InputTagSelect(item.Id,item.Name,false));        
    }

    toSearchParam(){
        const param =  this.searchform.value as SearchParam;
        param.AndLabelIds=new Array<string>();
        this.inputTagSelect.filter(x=>x.checked&&x.hide==false).map(c=>{
            param.AndLabelIds.push(c.id);
        });
        return param;
    }
}

export class SearchParam{
    Name:string;
    EncodeDeviceId:string;
    SearchText:string;
    CameraType:string;
    AndLabelIds:string[];
}