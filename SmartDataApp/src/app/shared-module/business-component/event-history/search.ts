import { DatePipe } from "@angular/common";
import { FormGroup, FormControl } from "@angular/forms";
import { Language } from "src/app/common/tool/language";
import { EventType } from "src/app/data-core/model/enum";
import { SearchHelper } from "../../../common/tool/table-form-helper";
import { Camera } from "../../../data-core/model/waste-regulation/camera";
import { GarbageStation } from "../../../data-core/model/waste-regulation/garbage-station";
export class SearchControl extends SearchHelper {
  beginDate = "";
  endDate = "";

  resourcesDropList = new Array<{ id: string; name: string }>();

  durationDropList = new Array<{ id: string; name: string }>();
  stationsDropList = new Array<{ id: string; name: string }>();
  EventTypeList = new Array<{ id: number; name: string }>();
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
      EventType: new FormControl(""),
      DropDuration: new FormControl(""),
      SearchName: new FormControl("StationName"),
    });
    this.EventTypeList = [
      {
        id: EventType.GarbageDrop,
        name: Language.GarbageDropEventType(EventType.GarbageDrop),
      },
      {
        id: EventType.GarbageDropHandle,
        name: Language.GarbageDropEventType(EventType.GarbageDropHandle, false),
      },
      {
        id: EventType.GarbageDropTimeout,
        name: Language.GarbageDropEventType(EventType.GarbageDropTimeout),
      },
      {
        id: EventType.GarbageDropTimeoutHandle,
        name: Language.GarbageDropEventType(
          EventType.GarbageDropTimeoutHandle,
          true
        ),
      },
    ];
    this.durationDropList = [
      { id: "0-30", name: "30分钟内" },
      { id: "30-60", name: "30分钟-1小时" },
      { id: "60-120", name: "1小时-2小时" },
      { id: "120-1440", name: "2小时以上" },
    ];
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
  private _divisionId: string;
  get divisionId() {
    return this._divisionId;
  }
  set divisionId(val: string) {
    this._divisionId = val;
    this.searchform.patchValue({
      DivisionId: val,
    });
  }

  private _formBeginDate: Date;
  set formBeginDate(v: Date) {
    this._formBeginDate = v;

    this.searchform.patchValue({
      BeginTime: this.datePipe.transform(v, "yyyy-MM-dd HH:mm"),
    });
  }
  get formBeginDate() {
    return this._formBeginDate;
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
      EventType: "",
      DropDuration: "",
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
  EventType: string;
  DropDuration: string;
  SearchName: string;
}
