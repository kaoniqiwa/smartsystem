import { DatePipe } from "@angular/common";
import { FormGroup, FormControl } from "@angular/forms";
import { SearchHelper } from "../../../common/tool/table-form-helper";
import {TimeInterval  } from "../../../common/tool/tool.service";
export class SearchControl extends SearchHelper {
   
    beginDate='';
    endDate='';

    constructor(private datePipe:DatePipe) {
        super();
        const day = TimeInterval(datePipe.transform(new Date(),'yyyy-MM-dd'),0,0,0,-1);
        this.beginDate= datePipe.transform(day.start,'yyyy-MM-dd');
        this.endDate=datePipe.transform(day.end,'yyyy-MM-dd');
        this.searchform = new FormGroup({
            BeginTime: new FormControl(''),
            EndTime: new FormControl(''),
            DivisionId: new FormControl(''),
            StationId: new FormControl(''),
            SearchText: new FormControl(''),
            EventType: new FormControl(''),
        });
    }

    set formBeginDate(v:Date){
        this.searchform.patchValue({
            BeginTime: this.datePipe.transform(v,'yyyy-MM-dd')
        });
    }

    set formEndDate(v:Date){
        this.searchform.patchValue({
            EndTime: this.datePipe.transform(v,'yyyy-MM-dd')
        });
    }

    clearState() {
        this.state = false;
        this.searchform.patchValue({
            BeginTime: '',
            EndTime: '',
            DivisionId: '',
            StationId: '',
            EventType:''
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
    EventType:string;
}