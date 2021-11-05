import {
  Component,
  Input,
  Output,
  OnInit,
  ViewChild,
  EventEmitter,
} from "@angular/core";
import { StatisticGarbageCountComponent } from "../statistic-garbage-count/statistic-garbage-count.component";
import { StatisticGarbageAnalyzeComponent } from "../statistic-garbage-analyze/statistic-garbage-analyze.component";
import {
  BusinessManageService,
  ViewDivisionTypeEnum,
} from "../../business-manage-service";
import { GarbageFullHistorySumChartComponent } from "../garbage-full-history-sum-chart/garbage-full-history-sum-chart.component";
import { GarbageStationSummaryViewPage } from "../view-helper";
import { GarbageStation } from "../../../../data-core/model/waste-regulation/garbage-station";
import { TableContentType } from "../garbage-drop-event-history/garbage-drop-event-history.component";
@Component({
  selector: "hw-garbage-station-summary",
  templateUrl: "./garbage-station-summary.component.html",
})
export class GarbageStationSummaryComponent implements OnInit {
  viewsShow = [true, false, false, false, false];
  @Input() divisionsId = "";

  @Input()
  garbageStationTableOperation: boolean = true;

  @ViewChild(StatisticGarbageCountComponent)
  garbageCountComponent: StatisticGarbageCountComponent;

  @ViewChild(StatisticGarbageAnalyzeComponent)
  analyzeComponent: StatisticGarbageAnalyzeComponent;

  @ViewChild(GarbageFullHistorySumChartComponent)
  garbageAnalyzeComponent: GarbageFullHistorySumChartComponent;

  @Output()
  garbageStationMoveToPosition = new EventEmitter<GarbageStation>();

  private _PageIndex: GarbageStationSummaryViewPage;
  public get PageIndex(): GarbageStationSummaryViewPage {
    return this._PageIndex;
  }
  @Input()
  public set PageIndex(v: GarbageStationSummaryViewPage) {
    this._PageIndex = v;
    if (this._PageIndex) this.acceptOtherView(this._PageIndex);
  }

  @Input()
  GarbageDropEventHistoryContentType: TableContentType;
  @Input()
  GarbageDropTaskDivisionId: string;

  @Input()
  GarbageDropEventHistoryHandle?: boolean;
  @Input()
  GarbageDropEventHistoryTimeout?: boolean;

  constructor(private businessManageService: BusinessManageService) {}

  ngOnInit() {
    if (
      this.businessManageService.viewDivisionType ==
        ViewDivisionTypeEnum.MapStation ||
      this.businessManageService.viewDivisionType ==
        ViewDivisionTypeEnum.TableLinkChild
    )
      this.acceptOtherView(GarbageStationSummaryViewPage.chart);
  }
  acceptOtherView(val: GarbageStationSummaryViewPage) {
    this.viewsShow[0] = val == GarbageStationSummaryViewPage.info;
    this.viewsShow[1] = val == GarbageStationSummaryViewPage.chart;
    this.viewsShow[2] = val == GarbageStationSummaryViewPage.sumChart;
    this.viewsShow[3] = val == GarbageStationSummaryViewPage.analyzeChart;
    this.viewsShow[4] = val == GarbageStationSummaryViewPage.event;
    if (val == GarbageStationSummaryViewPage.chart)
      this.garbageCountComponent.defaultStation();
    else if (val == GarbageStationSummaryViewPage.analyzeChart)
      this.analyzeComponent.initChart();
    else if (val == GarbageStationSummaryViewPage.sumChart)
      this.garbageAnalyzeComponent.initView();
  }

  onGarbageStationMoveToPosition(station: GarbageStation) {
    if (this.garbageStationMoveToPosition) {
      this.garbageStationMoveToPosition.emit(station);
    }
  }
}
