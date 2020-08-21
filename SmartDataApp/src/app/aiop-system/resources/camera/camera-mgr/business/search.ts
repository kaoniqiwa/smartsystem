import { FormGroup ,FormControl} from "@angular/forms"; 
import { InputTagSelect } from "../../../../../shared-module/input-tag-select/input-tag-select";
import { ResourceLabel } from "../../../../../data-core/model/resource-label";

export class SearchControl{
    searchform: FormGroup;
 
    inputTagSelect = Array<InputTagSelect>();
    /**是否搜索状态 */
    state = false;
    constructor(){
        this.searchform = new FormGroup({
            Name: new FormControl(''), 
            EncodeDeviceId: new FormControl(''), 
            CameraType: new FormControl(''),
            SearchText: new FormControl('')
        });
    }

    toInputTagSelect(list:ResourceLabel[]){
        for(const item of list)
            this.inputTagSelect.push(new InputTagSelect(item.Id,item.Name,false));        
    }

    toSearchParam(){
        const param :{Name:string,EncodeDeviceId:string,SearchText:string,CameraType:string}=  this.searchform.value;
        return param;
    }
}