import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BusinessEventTypeEnum } from "../business-event-type";
import { DivisionBusinessService } from "../../../../waste-regulation-system/index/business-card-grid/division-business.service";
import { sanitizeScript } from "@angular/core/src/sanitization/sanitization";
import { GarbageStation } from "../../../../data-core/model/waste-regulation/garbage-station";
@Component({
  selector: "hw-illegal-drop-event-summary",
  templateUrl: "./illegal-drop-event-summary.component.html",
  styleUrls: ["./illegal-drop-event-summary.component.styl"],
})
export class IllegalDropEventSummaryComponent implements OnInit {
  @Input() businessEventType = BusinessEventTypeEnum.IllegalDrop;
  // @Input() GarbageStation?: GarbageStation;

  private _GarbageStation: GarbageStation;
  public get GarbageStation(): GarbageStation {
    return this._GarbageStation;
  }
  @Input()
  public set GarbageStation(v: GarbageStation) {
    this._GarbageStation = v;
    console.log("IllegalDropEventSummaryComponent", v);
  }

  viewsShow = [false, false, false, false, false];
  defaultSearch = false;

  constructor(
    private divisionBusinessService: DivisionBusinessService,
    private route: ActivatedRoute
  ) {
    this.route.data.subscribe((params) => {
      this.defaultSearch = params.p != null;
    });
  }

  ngOnInit() {
    if (this.businessEventType == BusinessEventTypeEnum.IllegalDrop) {
      this.viewsShow[0] = true;
      this.viewsShow[4] = false;
    } else {
      this.viewsShow[4] = true;
      this.viewsShow[1] = false;
    }
  }

  acceptOtherView(val: OtherViewEnum) {
    const showView = (index: number) => {
      for (var i = 0; i < 5; i++) this.viewsShow[i] = i == index;
    };
    switch (val) {
      case OtherViewEnum.analyze:
        showView(OtherViewEnum.analyze);
        break;
      case OtherViewEnum.history:
        if (this.businessEventType == BusinessEventTypeEnum.IllegalDrop)
          showView(OtherViewEnum.history);
        else if (this.businessEventType == BusinessEventTypeEnum.MixedInfo)
          showView(OtherViewEnum.mixedInfo);
        break;
      case OtherViewEnum.chart:
        showView(OtherViewEnum.chart);
        break;
      case OtherViewEnum.sumChart:
        showView(OtherViewEnum.sumChart);
        break;
      default:
        break;
    }

    if (val == OtherViewEnum.chart && this.defaultSearch == false)
      setTimeout(() => {
        this.divisionBusinessService.illegalDropChartDefault.emit(
          this.divisionBusinessService.divisionsId
        );

        this.defaultSearch = true;
      }, 700);
  }
}

export enum OtherViewEnum {
  history,
  analyze,
  chart,
  sumChart,
  mixedInfo,
}
