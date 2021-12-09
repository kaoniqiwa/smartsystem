import {
  Component,
  Input,
  Output,
  OnInit,
  ViewChild,
  EventEmitter,
  AfterViewInit,
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
export class GarbageStationSummaryComponent implements OnInit, AfterViewInit {
  GarbageStationSummaryViewPage = GarbageStationSummaryViewPage;
  // viewsShow = [true, false, false, false, false];

  private _viewsShow: GarbageStationSummaryViewPage;
  public get viewsShow(): GarbageStationSummaryViewPage {
    return this._viewsShow;
  }
  @Input()
  public set viewsShow(v: GarbageStationSummaryViewPage) {
    this._viewsShow = v;
    setTimeout(() => {
      if (this._viewsShow == GarbageStationSummaryViewPage.chart) {
        this.garbageCountComponent.defaultStation();
      } else if (
        this._viewsShow == GarbageStationSummaryViewPage.analyzeChart
      ) {
        this.analyzeComponent.initChart();
      } else if (this._viewsShow == GarbageStationSummaryViewPage.sumChart) {
        this.garbageAnalyzeComponent.initView();
      } else {
      }
    }, 100);
  }

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

  @Input()
  GarbageDropEventHistoryContentType: TableContentType;
  @Input()
  GarbageDropTaskDivisionId: string;

  @Input()
  GarbageDropEventHistoryHandle?: boolean;
  @Input()
  GarbageDropEventHistoryTimeout?: boolean;

  constructor(private businessManageService: BusinessManageService) {}
  ngAfterViewInit(): void {}

  ngOnInit() {
    if (!this.viewsShow) {
      this.acceptOtherView(GarbageStationSummaryViewPage.info);
    }
    // if (
    //   this.businessManageService.viewDivisionType ==
    //     ViewDivisionTypeEnum.MapStation ||
    //   this.businessManageService.viewDivisionType ==
    //     ViewDivisionTypeEnum.TableLinkChild
    // )
    // this.acceptOtherView(GarbageStationSummaryViewPage.chart);
  }
  acceptOtherView(val: GarbageStationSummaryViewPage) {
    this.viewsShow = val;
  }

  onGarbageStationMoveToPosition(station: GarbageStation) {
    if (this.garbageStationMoveToPosition) {
      this.garbageStationMoveToPosition.emit(station);
    }
  }
}
