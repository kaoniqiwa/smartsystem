import { DatePipe } from "@angular/common";
import { FormGroup, FormControl } from "@angular/forms";
import { Language } from "src/app/common/tool/language";
import { SearchHelper } from "../../../../../common/tool/table-form-helper";
export class SearchControl extends SearchHelper {
  beginDate = "";

  constructor(private datePipe: DatePipe) {
    super();
    const day = new Date();
    this.beginDate = datePipe.transform(day, "yyyy年MM月dd日");
    this.searchform = new FormGroup({
      BeginTime: new FormControl(this.beginDate),
      Year: new FormControl(datePipe.transform(day, "yyyy")),
      Month: new FormControl(datePipe.transform(day, "MM")),
      Day: new FormControl(datePipe.transform(day, "dd")),
      TimeUnit: new FormControl(TimeUnitEnum.Week),
      ChartType: new FormControl(ChartTypeEnum.Bar),
      StationId: new FormControl(),
      ClassType: new FormControl(CategoryNameEnum.GarbageRatio),
    });
  }

  set formBeginDate(v: Date) {
    const param = this.toSearchParam();
    if (
      param.TimeUnit == TimeUnitEnum.Day ||
      param.TimeUnit == TimeUnitEnum.Week
    )
      this.searchform.patchValue({
        BeginTime: this.datePipe.transform(v, "yyyy年MM月dd日"),

        Year: this.datePipe.transform(v, "yyyy"),
        Month: this.datePipe.transform(v, "MM"),
        Day: this.datePipe.transform(v, "dd"),
      });
    else if (param.TimeUnit == TimeUnitEnum.Month)
      this.searchform.patchValue({
        BeginTime: this.datePipe.transform(v, "yyyy年MM月"),
        Year: this.datePipe.transform(v, "yyyy"),
        Month: this.datePipe.transform(v, "MM"),
      });
  }

  set stationId(val: Array<string>) {
    this.searchform.patchValue({
      StationId: val.join(","),
    });
  }

  toSearchParam() {
    const param = this.searchform.value as SearchParam;
    return param;
  }
}

export enum TimeUnitEnum {
  Day = "day",
  Week = "week",
  Month = "month",
}

export class SearchParam {
  BeginTime: string;
  EndTime: string;
  Year: string;
  Month: string;
  Day: string;
  DivisionId: string;
  StationId: string;
  TimeUnit: string;
  ChartType: string;
  ClassType: string;
}

export enum ChartTypeEnum {
  Line = "line",
  Bar = "bar",
}
export enum CategoryNameEnum {
  GarbageRatio = "garbageRatio",
  AvgGarbageTime = "avgGarbageTime",
  MaxGarbageTime = "maxGarbageTime",
  GarbageDuration = "garbageDuration",
  IllegalDrop = "illegalDrop",
  MixedInto = "mixedInto",
}

export class CategoryNameTextEnum {
  static garbageRatio = "达标率"
  static avgGarbageTime = "平均滞留时长"
  static maxGarbageTime = "最大滞留时长"
  static garbageDuration = "总滞留时长"
  static illegalDrop = Language.json.EventType.IllegalDrop
  static mixedInto = Language.json.EventType.MixedInto
}
