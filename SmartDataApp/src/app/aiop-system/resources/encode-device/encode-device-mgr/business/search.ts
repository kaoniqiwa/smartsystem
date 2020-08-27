import { FormGroup ,FormControl} from "@angular/forms"; 
import { InputTagSelect } from "../../../../../shared-module/input-tag-select/input-tag-select";
import { ResourceSearchParam,ResourceSearchControl } from "../../../../common/resource-search";
export class SearchControl  extends ResourceSearchControl<SearchParam>{ 
   
    inputTagSelect = Array<InputTagSelect>();
 
    constructor(){
        super();
        this.searchform = new FormGroup({
            Name: new FormControl(''), 
            Url: new FormControl(''), 
            OnlineStatus: new FormControl(''),
            SearchText: new FormControl('')
        });
    }

    clearState(){
        this.state=false;
        this.searchform.patchValue({
            SearchText:'',
            Name:'',
            Url:'',
            OnlineStatus:''
        });
    } 
 
}


export class SearchParam extends ResourceSearchParam{
    Name:string;
    Url:string;
    SearchText:string;
    OnlineStatus:string;
    AndLabelIds:string[];
}