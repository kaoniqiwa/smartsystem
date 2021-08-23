import { DatePipe } from "@angular/common";
import { FormGroup, FormControl } from "@angular/forms";
import { SearchHelper } from "../../../../../common/tool/table-form-helper";
import {
  ClassTypeEnum,
  TimeUnitEnum,
  SearchParam,
} from "../../illegal-drop-event-analyze/business/search";
import { SessionUser } from "../../../../../common/tool/session-user";
import { DivisionType } from "../../../../../data-core/model/enum";

export class SearchControl extends SearchHelper {
  beginDate = "";

  constructor(private datePipe: DatePipe) {
    super();
    const day = new Date(),
      su = new SessionUser(),
      classType =
        su.userDivisionType == DivisionType.City
          ? ClassTypeEnum.County
          : ClassTypeEnum.Committees;
    this.beginDate = datePipe.transform(day, "yyyy年MM月dd日");
    this.searchform = new FormGroup({
      BeginTime: new FormControl(this.beginDate),
      EndTime: new FormControl(""),
      Year: new FormControl(datePipe.transform(day, "yyyy")),
      Month: new FormControl(datePipe.transform(day, "MM")),
      Day: new FormControl(datePipe.transform(day, "dd")),
      DivisionId: new FormControl(""),
      StationId: new FormControl(""),
      ClassType: new FormControl(classType),
      TimeUnit: new FormControl(TimeUnitEnum.Hour),
    });
  }

  set divisionId(val: Array<string>) {
    this.searchform.patchValue({
      DivisionId: val.join(","),
    });
  }

  set stationId(val: Array<string>) {
    this.searchform.patchValue({
      StationId: val.join(","),
    });
  }

  set formBeginDate(v: Date) {
    const param = this.toSearchParam();
    if (
      param.TimeUnit == TimeUnitEnum.Hour ||
      param.TimeUnit == TimeUnitEnum.Week
    )
      this.searchform.patchValue({
        BeginTime: this.datePipe.transform(v, "yyyy年MM月dd日"),
        EndTime: "",
        Year: this.datePipe.transform(v, "yyyy"),
        Month: this.datePipe.transform(v, "MM"),
        Day: this.datePipe.transform(v, "dd"),
      });
    else if (param.TimeUnit == TimeUnitEnum.Day)
      this.searchform.patchValue({
        BeginTime: this.datePipe.transform(v, "yyyy年MM月"),
        EndTime: "",
        Year: this.datePipe.transform(v, "yyyy"),
        Month: this.datePipe.transform(v, "MM"),
      });
  }

  toSearchParam() {
    const param = this.searchform.value as SearchParam;
    return param;
  }
}
