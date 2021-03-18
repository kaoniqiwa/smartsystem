import { DatePipe } from "@angular/common";
import { FormGroup, FormControl } from "@angular/forms"; 
import { SearchHelper } from "../../../../../common/tool/table-form-helper";  
import { Division } from "../../../../../data-core/model/waste-regulation/division";
export class SearchControl extends SearchHelper {

    beginDate = '';
    divisionsDropList  = new Array<{id:string,name:string}>();
    constructor(private datePipe: DatePipe) {
        super();
        const day = new Date();
        this.beginDate = datePipe.transform(day, 'yyyy年MM月dd日'); 
        this.searchform = new FormGroup({
            BeginTime: new FormControl( this.beginDate),          
            Year:new FormControl(datePipe.transform(day, 'yyyy')),
            Month:new FormControl(datePipe.transform(day, 'MM')),
            Day:new FormControl(datePipe.transform(day, 'dd')),             
            TimeUnit: new FormControl(TimeUnitEnum.Day),
            StationId:new FormControl(),
            DivisionId:new FormControl(),
        });
    } 

    set formBeginDate(v: Date) { 
        const param = this.toSearchParam();
        if (param.TimeUnit == TimeUnitEnum.Day||param.TimeUnit == TimeUnitEnum.Week)
            this.searchform.patchValue({
                BeginTime: this.datePipe.transform(v, 'yyyy年MM月dd日'),
                
                Year:this.datePipe.transform(v, 'yyyy'),
                Month:this.datePipe.transform(v, 'MM'),
                Day:this.datePipe.transform(v, 'dd'),
            });
        else if (param.TimeUnit == TimeUnitEnum.Month)
            this.searchform.patchValue({
                BeginTime: this.datePipe.transform(v, 'yyyy年MM月'),          
                Year:this.datePipe.transform(v, 'yyyy'),
                Month:this.datePipe.transform(v, 'MM')
            });
    }    

    set stationId(val: Array<string>) {
        this.searchform.patchValue({
            StationId: val.join(','),
        });
    }

    set divisionId(val: string) {
        this.searchform.patchValue({
            DivisionId: val
        });
    }

    set toDivisionsDropList(division: Array<Division>) {
        if (division) {
            this.divisionsDropList = new Array();
            for (const x of division)
                this.divisionsDropList.push({
                    name: x.Name,
                    id: x.Id
                });
        }
    }

    toSearchParam() {
        const param = this.searchform.value as SearchParam;
        return param;
    }
}  

export enum TimeUnitEnum {
  
    Day = 'day',
    Week='week',
    Month='month'
} 

export class SearchParam {
    BeginTime: string;
    EndTime: string;
    Year:string;
    Month:string;
    Day:string;
    DivisionId: string;
    StationId: string;
    TimeUnit: string;
    ChartType: string;
    ClassType:string;
}