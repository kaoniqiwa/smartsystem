import { FormGroup ,FormControl} from "@angular/forms"; 
import { ResourceSearchParam,ResourceSearchControl } from "../../../../common/resource-search";
import { InputTagSelect } from "../../../../../shared-module/input-tag-select/input-tag-select";
import { CameraAIModel } from "../../../../../data-core/model/camera-ai-model";
export class SearchControl extends ResourceSearchControl<SearchParam>{ 
    // aiModelsInputTagSelect = Array<InputTagSelect>();
    // toAIModelInputTagSelect(list:CameraAIModel[]){
    //     for(const item of list)
    //         this.aiModelsInputTagSelect.push(new InputTagSelect(item.Id,item.ModelName,false));        
    // }
    constructor(){
        super();
        this.searchform = new FormGroup({
            Name: new FormControl(''),
        });
    }

    clearState(){
        this.state=false;
        this.searchform.patchValue({       
            Name:''
        });
    } 
}

export class SearchParam extends ResourceSearchParam{
    Name:string;
    //AIModelIds:string[];
    AndLabelIds:string[];
}