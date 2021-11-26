import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DivisionBusinessService } from "../../../../waste-regulation-system/index/business-card-grid/division-business.service";
import { GarbageStation } from "../../../../data-core/model/waste-regulation/garbage-station";
import { GlobalStoreService } from "src/app/shared-module/global-store.service";
import { EventType } from "src/app/data-core/model/enum";

@Component({
  selector: "hw-illegal-drop-event-summary",
  templateUrl: "./illegal-drop-event-summary.component.html",
  styleUrls: ["./illegal-drop-event-summary.component.styl"],
})
export class IllegalDropEventSummaryComponent implements OnInit {
  private _businessEventType: EventType = EventType.IllegalDrop;
  public get businessEventType(): EventType {
    return this._businessEventType;
  }
  @Input()
  public set businessEventType(v: EventType) {
    this._businessEventType = v;
    this.ngOnInit();
  }

  // @Input() GarbageStation?: GarbageStation;

  private _GarbageStation?: GarbageStation;
  public get GarbageStation(): GarbageStation | undefined {
    return this._GarbageStation;
  }
  @Input()
  public set GarbageStation(v: GarbageStation | undefined) {
    this._GarbageStation = v;
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
    for (let i = 0; i < this.viewsShow.length; i++) {
      this.viewsShow[i] = false;
    }
    switch (this.businessEventType) {
      case EventType.IllegalDrop:
        this.viewsShow[0] = true;
        this.viewsShow[4] = false;
        break;
      case EventType.MixedInto:
        this.viewsShow[4] = true;
        this.viewsShow[1] = false;
        break;

      default:
        break;
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
        if (this.businessEventType == EventType.IllegalDrop)
          showView(OtherViewEnum.history);
        else if (this.businessEventType == EventType.MixedInto)
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
          GlobalStoreService.divisionId
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
