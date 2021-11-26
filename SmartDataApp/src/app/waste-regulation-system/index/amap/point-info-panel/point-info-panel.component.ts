import { DatePipe } from "@angular/common";
import { Output, EventEmitter } from "@angular/core";
import { Component, Input, OnInit } from "@angular/core";
import { _getOptionScrollPosition } from "@angular/material";

import { Language } from "../../../../common/tool/language";
import { EventType, StationState } from "../../../../data-core/model/enum";
import { GarbageStation } from "../../../../data-core/model/waste-regulation/garbage-station";
import { DivisionRequestService } from "../../../../data-core/repuest/division.service";
import { GarbageStationRequestService } from "../../../../data-core/repuest/garbage-station.service";

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

  /**
   *  状态点击事件
   *
   * @type {EventEmitter<GarbageStation>}
   * @memberof PointInfoPanelComponent
   */
  @Output()
  StateClickedEvent: EventEmitter<GarbageStation> = new EventEmitter();

  @Output()
  GarbageCountClickedEvent: EventEmitter<GarbageStation> = new EventEmitter();

  @Output()
  IllegalDropClickedEvent: EventEmitter<GarbageStation> = new EventEmitter();

  @Output()
  MixedIntoClickedEvent: EventEmitter<GarbageStation> = new EventEmitter();

  constructor(
    private divisionService: DivisionRequestService,
    private garbageStationService: GarbageStationRequestService,
    private datePipe: DatePipe
  ) {
    // this.GarbageStation.Members
  }

  ngOnInit() {}

  onGarbageStationChanged(station: GarbageStation) {
    this.state.language = Language.StationStateFlags(station.StationStateFlags);
    if (station.StationStateFlags.contains(StationState.Error)) {
      this.state.className = "error";
    } else if (station.StationStateFlags.contains(StationState.Full)) {
      this.state.className = "warm";
    } else {
      this.state.language = "";
      this.state.className = "normal";
    }

    this.divisionService.get(station.DivisionId).then((res) => {
      this.committeeName = res.Name;
      this.divisionService.get(res.ParentId).then((res) => {
        this.roadName = res.Name;
      });
    });
    this.garbageStationService.statisticNumber(station.Id).then((statistic) => {
      this.GarbageCount = statistic.GarbageCount;
      // 是否满溢
      // DryFull
      // 评分
      // Grade
      // 当前时长
      // CurrentGarbageTime
      console.log("statisticNumber", statistic);
      this.GarbageStationGrade =
        statistic.GarbageRatio === 100
          ? "100"
          : statistic.GarbageRatio.toFixed(2);

      let hour = Math.floor(statistic.CurrentGarbageTime / 60);
      let minute = Math.ceil(statistic.CurrentGarbageTime % 60);

      this.GarbageInterval = hour ? hour + "小时" : "";
      this.GarbageInterval = this.GarbageInterval
        ? this.GarbageInterval
        : minute + "分钟";

      if (statistic.TodayEventNumbers) {
        for (let i = 0; i < statistic.TodayEventNumbers.length; i++) {
          const item = statistic.TodayEventNumbers[i];
          switch (item.EventType) {
            case EventType.IllegalDrop:
              this.IllegalDropCount = item.DeltaNumber;
              break;
            case EventType.MixedInto:
              this.MixedIntoCount = item.DeltaNumber;
              break;

            default:
              break;
          }
        }
      }
    });
  }
  GarbageStationGrade: string = "0";
  GarbageInterval: string = "";
  GarbageCount: number = 0;
  IllegalDropCount: number = 0;
  MixedIntoCount: number = 0;

  state = {
    language: "",
    className: "normal",
  };

  onGarbageCountClicked() {
    if (this.GarbageCount <= 0) return;
    if (this.GarbageCountClickedEvent) {
      this.GarbageCountClickedEvent.emit(this.GarbageStation);
    }
  }
  onIllegalDropClicked() {
    if (this.IllegalDropCount <= 0) return;
    if (this.IllegalDropClickedEvent) {
      this.IllegalDropClickedEvent.emit(this.GarbageStation);
    }
  }
  onMixedIntoClicked() {
    if (this.MixedIntoCount <= 0) return;
    if (this.MixedIntoClickedEvent) {
      this.MixedIntoClickedEvent.emit(this.GarbageStation);
    }
  }
  onStateClicked() {
    if (
      this.GarbageStation.StationStateFlags.contains(StationState.Error) ||
      this.GarbageStation.StationStateFlags.contains(StationState.Full)
    )
      if (this.StateClickedEvent) {
        this.StateClickedEvent.emit(this.GarbageStation);
      }
  }
}
