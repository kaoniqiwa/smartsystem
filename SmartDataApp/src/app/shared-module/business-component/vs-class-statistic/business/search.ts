import { DatePipe } from "@angular/common";
import { FormGroup, FormControl } from "@angular/forms";
import { SearchHelper } from "../../../../common/tool/table-form-helper";
export class SearchControl extends SearchHelper {

    beginDate = '';
    constructor(private datePipe: DatePipe) {
        super();
        const day = new Date();
        this.beginDate = datePipe.transform(day, 'yyyy年MM月dd日');
        this.searchform = new FormGroup({
            BeginTime: new FormControl(this.beginDate),
            EndTime: new FormControl(''),
            Year: new FormControl(datePipe.transform(day, 'yyyy')),
            Month: new FormControl(datePipe.transform(day, 'MM')),
            Day: new FormControl(datePipe.transform(day, 'dd')),
            DivisionId1: new FormControl(''),
            StationId1: new FormControl(''),
            DivisionId2: new FormControl(''),
            StationId2: new FormControl(''),
            ClassType: new FormControl(ClassTypeEnum.Division),
            TimeUnit: new FormControl(TimeUnitEnum.Hour),
            InputDateTime: new FormControl(''),
        });
    }

    set divisionId2(val: string) {
        this.searchform.patchValue({
            DivisionId2: val
        });
    }

    set stationId2(val: string) {
        this.searchform.patchValue({
            StationId2: val
        });
    }

    set divisionId1(val: string) {
        this.searchform.patchValue({
            DivisionId1: val
        });
    }

    set stationId1(val: string) {
        this.searchform.patchValue({
            StationId1: val
        });
    }

    set formBeginDate(v: Date) {
        const param = this.toSearchParam();
        if (param.TimeUnit == TimeUnitEnum.Hour || param.TimeUnit == TimeUnitEnum.Week) {
            this.beginDate = this.datePipe.transform(v, 'yyyy年MM月dd日');
            this.searchform.patchValue({
                BeginTime: this.beginDate,
                EndTime: '',
                Year: this.datePipe.transform(v, 'yyyy'),
                Month: this.datePipe.transform(v, 'MM'),
                Day: this.datePipe.transform(v, 'dd'),
                InputDateTime: this.datePipe.transform(v, 'yyyy-MM-dd')
            });
        }
        else if (param.TimeUnit == TimeUnitEnum.Day) {
            this.beginDate = this.datePipe.transform(v, 'yyyy年MM月');
            this.searchform.patchValue({
                BeginTime: this.beginDate,
                EndTime: '',
                Year: this.datePipe.transform(v, 'yyyy'),
                Month: this.datePipe.transform(v, 'MM'),
                InputDateTime: this.datePipe.transform(v, 'yyyy-MM')
            });
        }
    }

      

    toSearchParam() {
        const param = this.searchform.value as SearchParam;
        return param;
    }
}

export enum TimeUnitEnum {
    Hour = 'hour',
    Day = 'day',
    Week = 'week'
}

export enum ClassTypeEnum {
    Division = 'division',
    Station = 'station'
}


export class SearchParam {
    BeginTime: string;
    EndTime: string;
    Year: string;
    Month: string;
    Day: string;
    DivisionId1: string;
    StationId1: string;
    DivisionId2: string;
    StationId2: string;
    TimeUnit: string;
    ClassType: string;
    InputDateTime: string;
}