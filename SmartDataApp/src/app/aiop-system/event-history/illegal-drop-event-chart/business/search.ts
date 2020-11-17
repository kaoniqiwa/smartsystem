import { DatePipe } from "@angular/common";
import { FormGroup, FormControl } from "@angular/forms"; 
import { SearchHelper } from "../../../../common/tool/table-form-helper";
import { Division } from "../../../../data-core/model/waste-regulation/division";
import { GarbageStation } from "../../../../data-core/model/waste-regulation/garbage-station";
export class SearchControl extends SearchHelper {

    beginDate = '';

    stationsDropList = new Array<{ id: string, name: string }>();
    divisionsDropList = new Array<{ id: string, name: string }>();
    constructor(private datePipe: DatePipe) {
        super();
        const day = new Date();
        this.beginDate = datePipe.transform(day, 'yyyy年MM月dd日'); 
        this.searchform = new FormGroup({
            BeginTime: new FormControl( this.beginDate),
            EndTime: new FormControl(''),
            Year:new FormControl(datePipe.transform(day, 'yyyy')),
            Month:new FormControl(datePipe.transform(day, 'MM')),
            Day:new FormControl(datePipe.transform(day, 'dd')),
            DivisionId: new FormControl(''),
            StationId: new FormControl(''),
            TimeUnit: new FormControl(TimeUnitEnum.Hour),
            ChartType: new FormControl(ChartTypeEnum.Line),
        });
    }

    set toStationsDropList(station: GarbageStation[]) {
        if (station) {
            this.stationsDropList = new Array();
            for (const x of station)
                this.stationsDropList.push({
                    name: x.Name,
                    id: x.Id
                });
        }
    }

    set toDivisionsDropList(division: Division[]) {
        if (division) {
            this.divisionsDropList = new Array();
            for (const x of division)
                this.divisionsDropList.push({
                    name: x.Name,
                    id: x.Id
                });
        }
    }
    set stationId(val: string) {
        this.searchform.patchValue({
            StationId: val,
        });
    }

    set divisionId(val: string) {
        this.searchform.patchValue({
            DivisionId: val,
        });
    }

    set formBeginDate(v: Date) { 
        const param = this.toSearchParam();
        if (param.TimeUnit == TimeUnitEnum.Hour || param.TimeUnit==TimeUnitEnum.Week)
            this.searchform.patchValue({
                BeginTime: this.datePipe.transform(v, 'yyyy年MM月dd日'),
                EndTime:'',
                Year:this.datePipe.transform(v, 'yyyy'),
                Month:this.datePipe.transform(v, 'MM'),
                Day:this.datePipe.transform(v, 'dd'),
            });
        else if (param.TimeUnit == TimeUnitEnum.Day)
            this.searchform.patchValue({
                BeginTime: this.datePipe.transform(v, 'yyyy年MM月'),
                EndTime:'',
                Year:this.datePipe.transform(v, 'yyyy'),
                Month:this.datePipe.transform(v, 'MM')
            });
        // else if (param.TimeUnit == TimeUnitEnum.Week)
        // this.searchform.patchValue({
        //     BeginTime: this.datePipe.transform(v, 'yyyy年MM月dd日'),
        //     EndTime:''
        // }); 
    }    

    toSearchParam() {
        const param = this.searchform.value as SearchParam;
        return param;
    }
}

export enum TimeUnitEnum {
    Hour = 'hour',
    Day = 'day',
    Week='week'
}

export enum ChartTypeEnum {
    Line = 'line',
    Bar = 'bar'
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
}