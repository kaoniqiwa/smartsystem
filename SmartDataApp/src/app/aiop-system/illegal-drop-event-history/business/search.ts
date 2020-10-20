import { DatePipe } from "@angular/common";
import { FormGroup, FormControl } from "@angular/forms";
import { SearchHelper } from "../../../common/tool/table-form-helper";
import {TimeInterval  } from "../../../common/tool/tool.service";
export class SearchControl extends SearchHelper {
   
    beginDate='';
    endDate='';

    constructor(private datePipe:DatePipe) {
        super();
        const day = new Date();
        this.beginDate= datePipe.transform(day,'yyyy-MM-dd')+' 00:00';
        this.endDate=datePipe.transform(day,'yyyy-MM-dd')+' 23:59';
        this.searchform = new FormGroup({
            BeginTime: new FormControl(''),
            EndTime: new FormControl(''),
            DivisionId: new FormControl(''),
            StationId: new FormControl(''),
            SearchText: new FormControl(''),
            ResourceId: new FormControl(''),
        });
    }

    set formBeginDate(v:Date){
        this.searchform.patchValue({
            BeginTime: this.datePipe.transform(v,'yyyy-MM-dd HH:mm')
        });
    }

    set formEndDate(v:Date){
        this.searchform.patchValue({ 
            EndTime: this.datePipe.transform(v,'yyyy-MM-dd HH:mm')
        });
    }

    clearState() {
        this.state = false;
        this.searchform.patchValue({
            BeginTime: '',
            EndTime: '',
            DivisionId: '',
            StationId: '',
            ResourceId:''
        });
    }

    toSearchParam(){
        const param =  this.searchform.value as SearchParam; 
        return param;
    }
}


export class SearchParam {
    BeginTime: string;
    EndTime: string;
    DivisionId: string;
    StationId: string;    
    SearchText:string;
    ResourceId:string;
}