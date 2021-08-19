import { DatePipe } from "@angular/common";
import { FormGroup, FormControl } from "@angular/forms";
import { SearchHelper } from "../../../common/tool/table-form-helper";
import { Camera } from "../../../data-core/model/waste-regulation/camera";
import { GarbageStation } from "../../../data-core/model/waste-regulation/garbage-station";
export class SearchControl extends SearchHelper {
  beginDate = "";
  endDate = "";

  resourcesDropList = new Array<{ id: string; name: string }>();
  stationsDropList = new Array<{ id: string; name: string }>();
  constructor(private datePipe: DatePipe) {
    super();
    const day = new Date();
    this.beginDate = datePipe.transform(day, "yyyy-MM-dd") + " 00:00";
    this.endDate = datePipe.transform(day, "yyyy-MM-dd") + " 23:59";
    this.searchform = new FormGroup({
      BeginTime: new FormControl(""),
      EndTime: new FormControl(""),
      DivisionId: new FormControl(""),
      StationId: new FormControl(""),
      SearchText: new FormControl(""),
      ResourceId: new FormControl(""),
    });
  }

  set stationId(val: string) {
    this.searchform.patchValue({
      StationId: val,
    });
  }

  appendResourcesDropList(cameras: Camera[]) {
    if (cameras) {
      this.resourcesDropList = new Array();
      for (const x of cameras)
        this.resourcesDropList.push({
          name: x.Name,
          id: x.Id,
        });
    }
  }

  appendStationsDropList(station: GarbageStation[]) {
    if (station) {
      this.stationsDropList = new Array();
      for (const x of station)
        this.stationsDropList.push({
          name: x.Name,
          id: x.Id,
        });
    }
  }

  set divisionId(val: string) {
    this.searchform.patchValue({
      DivisionId: val,
    });
  }

  set formBeginDate(v: Date) {
    this.searchform.patchValue({
      BeginTime: this.datePipe.transform(v, "yyyy-MM-dd HH:mm"),
    });
  }

  set formEndDate(v: Date) {
    this.searchform.patchValue({
      EndTime: this.datePipe.transform(v, "yyyy-MM-dd HH:mm"),
    });
  }

  clearState() {
    this.state = false;
    this.searchform.patchValue({
      BeginTime: "",
      EndTime: "",
      DivisionId: "",
      StationId: "",
      ResourceId: "",
    });
  }

  toSearchParam() {
    const param = this.searchform.value as SearchParam;
    return param;
  }
}

export class SearchParam {
  BeginTime: string;
  EndTime: string;
  DivisionId: string;
  StationId: string;
  SearchText: string;
  ResourceId: string;
}
