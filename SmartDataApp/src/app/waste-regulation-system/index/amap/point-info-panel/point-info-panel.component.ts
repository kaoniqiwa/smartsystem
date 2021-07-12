import { Component, Input, OnInit } from "@angular/core";
import { _getOptionScrollPosition } from "@angular/material";
import { GarbageStation } from "src/app/data-core/model/waste-regulation/garbage-station";
import { GetGarbageStationStatisticGarbageCountsParams } from "src/app/data-core/model/waste-regulation/garbage-station-number-statistic";
import { DivisionRequestService } from "src/app/data-core/repuest/division.service";
import { GarbageStationRequestService } from "src/app/data-core/repuest/garbage-station.service";

@Component({
  selector: "app-point-info-panel",
  templateUrl: "./point-info-panel.component.html",
  styleUrls: ["./point-info-panel.component.css"],
})
export class PointInfoPanelComponent implements OnInit {
  visibility: boolean;

  private committeeName: string = ""; // 居委会名称
  private roadName: string = ""; // 街道名称

  _GarbageStation: GarbageStation;
  @Input()
  set GarbageStation(val) {
    this._GarbageStation = val;

    this.onGarbageStationChanged(this._GarbageStation);
  }

  get GarbageStation() {
    return this._GarbageStation;
  }

  @Input()
  VisibilityChange = (val: boolean) => {
    this.visibility = val;
  };

  constructor(
    private divisionService: DivisionRequestService,
    private garbageStationService: GarbageStationRequestService
  ) {
    // this.GarbageStation.Members
  }

  ngOnInit() {}
  private _division = 0;
  get division() {
    // this.divisionService.get(this.GarbageStation.DivisionId).toPromise().then(res=>{
    //     console.log(res)
    // })
    console.log(++this._division);
    return this._division;
  }
  set division(val) {
    this._division = val;
  }

  onGarbageStationChanged(station: GarbageStation) {
    this.divisionService
      .get(station.DivisionId)
      .toPromise()
      .then((res) => {
        console.log("居委会", res);
        this.committeeName = res.Data.Name;
        this.divisionService
          .get(res.Data.ParentId)
          .toPromise()
          .then((res) => {
            console.log("街道", res);
            this.roadName = res.Data.Name;
          });
      });
    this.garbageStationService
      .statisticNumber(station.Id)
      .toPromise()
      .then((res) => {
        let statistic = res.Data;
        this.GarbageCount = statistic.GarbageCount;
        this.MaxGarbageCount = statistic.MaxGarbageCount;
      });
  }

  GarbageCount: number;
  MaxGarbageCount: number;
  IllegalDropCount: number;
  MixedIntoCount: number;
}
