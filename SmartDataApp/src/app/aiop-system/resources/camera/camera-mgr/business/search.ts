import { FormGroup ,FormControl} from "@angular/forms"; 
import { ResourceSearchParam,ResourceSearchControl } from "../../../../common/resource-search";
export class SearchControl extends ResourceSearchControl<SearchParam>{ 
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
}

export class SearchParam extends ResourceSearchParam{
    Name:string;
    EncodeDeviceId:string;
    SearchText:string;
    CameraType:string;
    AndLabelIds:string[];
}