import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { GarbageStation } from "src/app/data-core/model/waste-regulation/garbage-station";
import { DivisionBusinessService } from "../../../../waste-regulation-system/index/business-card-grid/division-business.service";
@Component({
  selector: "hw-full-garbage-station-summary",
  templateUrl: "./full-garbage-station-summary.component.html",
})
export class FullGarbageStationSummaryComponent implements OnInit {
  viewsShow = [true, false];
  @Input() divisionsId = "";
  @Input() GarbageStation?: GarbageStation;
  constructor(private divisionBusinessService: DivisionBusinessService) {}

  ngOnInit() {}
  acceptOtherView(val: OtherViewEnum) {
    this.viewsShow[0] = val == OtherViewEnum.info;
    this.viewsShow[1] = val == OtherViewEnum.event;
  }
}
export enum OtherViewEnum {
  event,
  info,
}
