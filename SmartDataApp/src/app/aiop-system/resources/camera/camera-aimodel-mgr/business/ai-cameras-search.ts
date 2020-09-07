import { FormGroup ,FormControl} from "@angular/forms"; 
import { ResourceSearchParam,ResourceSearchControl } from "../../../../common/resource-search";  
export class SearchControl extends ResourceSearchControl<SearchParam>{ 
  
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