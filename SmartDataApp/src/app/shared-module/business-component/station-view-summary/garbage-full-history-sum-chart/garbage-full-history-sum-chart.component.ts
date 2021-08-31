import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  ElementRef,
  Input,
} from "@angular/core";
import { BusinessService } from "./business/business.service";
import { DateTimePickerDirective } from "../../../../common/directive/date-time-picker.directive";
import { GarbageStationDao } from "../../../../data-core/dao/garbage-station-dao";
import { DivisionDao } from "../../../../data-core/dao/division-dao";
import { LevelListPanelComponent } from "../../event-history/level-list-panel/level-list-panel.component";
import {
  BusinessManageService,
  ViewDivisionTypeEnum,
} from "../../business-manage-service";
import { GarbageStationSummaryViewPage } from "../view-helper";
import { HWCsvContext, StationSumHistoryCsv } from "../../export-csv-file";
import { HWXlsxContext, StationSumHistoryXlsx } from "../../export-xlsx-file";
import { DivisionType } from "../../../../data-core/model/enum";
import { GlobalStoreService } from "src/app/shared-module/global-store.service";
@Component({
  selector: "hw-garbage-full-history-sum-chart",
  templateUrl: "./garbage-full-history-sum-chart.component.html",
  styleUrls: ["./garbage-full-history-sum-chart.component.styl"],
  providers: [BusinessService, GarbageStationDao, DivisionDao],
})
export class GarbageFullHistorySumChartComponent implements OnInit {
  @Output() OtherViewEvent = new EventEmitter<GarbageStationSummaryViewPage>();

  @ViewChild(DateTimePickerDirective)
  timePicker: DateTimePickerDirective;

  @ViewChild(LevelListPanelComponent)
  levelListPanel: LevelListPanelComponent;

  otherView = GarbageStationSummaryViewPage;

  @ViewChild("dtp")
  dtp: ElementRef;

  get dataSource() {
    return this.businessService.divisionListView.dataSource;
  }

  private _divisionId: string;
  public get divisionId(): string {
    return this._divisionId;
  }

  delayTimeout = 5 * 1000;

  delayHandle?: NodeJS.Timer;
  delay = {
    timeout: {
      handle: undefined,
      interval: 5 * 1000,
    },
    handle: undefined,
    stop: () => {
      clearTimeout(this.delay.handle);
      this.delay.handle = undefined;
    },
    run: (p: () => boolean, todo: () => void, firstRun = true) => {
      if (firstRun) {
        if (this.delay.handle) {
          this.delay.stop();
        }
        this.delay.timeout.handle = setTimeout(() => {
          this.delay.stop();
        }, this.delay.timeout.interval);
      }
      this.delay.handle = setTimeout(() => {
        if (!p()) {
          this.delay.run(p, todo, false);
          return;
        }
        todo();
      }, 10);
    },
  };

  @Input()
  public set divisionId(v: string) {
    this._divisionId = v;
    if (this._divisionId) {
      debugger;
      this.delay.run(
        () => {
          return (
            !!this.levelListPanel || this.businessService.divisions.length > 0
          );
        },
        () => {
          if (this.levelListPanel)
            this.levelListPanel.defaultItem(this._divisionId);
          else if (this.businessService.divisions.length > 0) {
            this.businessService.search.divisionId = this._divisionId;
            this.changeDivision(this._divisionId).then((x) => {
              this.search();
            });
          } else {
          }
        }
      );
    }
  }

  startDate = (b: Date) => {
    this.businessService.search.formBeginDate = b;
    this.businessService.requestData();
  };
  changeDivisionFn = (id: string) => {
    const county = this.businessService.divisions.find(
      (d) => d.DivisionType == DivisionType.County && d.Id == id
    );
    if (id && this.businessService.garbageStations && county == null) {
      const filter = this.businessService.garbageStations.filter(
        (x) => x.DivisionId == id
      );
      const ids = new Array<string>();
      filter.map((c) => ids.push(c.Id));
      this.businessService.search.stationId = ids;
    } else if (county) {
      const ids = new Array<string>();
      this.businessService.garbageStations.map((c) => ids.push(c.Id));
      this.businessService.search.stationId = ids;
    }
    this.businessService.requestData();
  };

  constructor(
    private businessService: BusinessService,
    private divisionDao: DivisionDao,
    private businessManageService: BusinessManageService,
    private garbageStationDao: GarbageStationDao,
    private globalService: GlobalStoreService
  ) {}

  async ngOnInit() {}

  async initView() {
    // const divisions = await  this.businessManageService.getParentDivision();
    this.businessManageService.divisionType(this.globalService.divisionType);

    if (
      this.businessManageService.viewDivisionType == ViewDivisionTypeEnum.City
    ) {
      this.businessManageService.getchildrenDivision().then((c) => {
        /** 查志磊 */
        this.businessService.divisions = c;
        this.businessService.search.toDivisionsDropList = c.filter(
          (f) => f.DivisionType == DivisionType.County
        );
        if (this.businessService.search.divisionsDropList.length) {
          this.businessService.search.divisionId =
            this.businessService.search.divisionsDropList[0].id;
          this.changeDivision(
            this.businessService.search.divisionsDropList[0].id
          );
        }
      });
    } else {
      this.garbageStationDao.allGarbageStations().then((stations) => {
        this.businessService.garbageStations = stations;
        // const ids = new Array<string>();
        // stations.map(c => ids.push(c.Id));
        // this.businessService.search.stationId = ids;

        // this.businessService.statisticTable.initPagination({
        //   PageIndex: 1,
        //   PageSize: 1,
        //   PageCount: this.businessService.statisticTable.dataSource.values.length,
        //   RecordCount: this.businessService.statisticTable.dataSource.values.length,
        //   TotalRecordCount:this.businessService.statisticTable.dataSource.values.length,
        // },  (index) => {});
      });
      this.divisionDao.allDivisions().then((divisions) => {
        this.businessService.divisions = divisions;
        this.businessService.initDivisionListView();
        const county = divisions.find(
          (d) => d.DivisionType == DivisionType.County
        );

        this.delay.run(
          () => {
            return (
              !!this.levelListPanel &&
              !!this.businessService.garbageStations &&
              // 此地可能产生异常，获取到的厢房如果真实为0，那程序会循环在这里
              this.businessService.garbageStations.length > 0
            );
          },
          () => {
            debugger;
            if (county) {
              let id = county.Id;
              if (this.divisionId) {
                id = this.divisionId;
              }
              this.levelListPanel.defaultItem(id);
            }
          }
        );
      });
    }
  }

  changeDivision(id: string) {
    const ids = new Array<string>();
    return this.businessManageService.getGarbageStations(id).then((items) => {
      console.log(items);

      items.map((i) => ids.push(i.Id));
      this.businessService.search.stationId = ids;
    });
  }

  changeTimeType() {
    const val = this.businessService.changeDatePicker();
    this.timePicker.reInit(
      this.businessService.datePicker.startView,
      this.businessService.datePicker.minView,
      this.businessService.datePicker.formate,
      val.time,
      val.week
    );
    this.search();
  }

  search() {
    this.businessService.requestData();
  }

  changeOtherView(val: GarbageStationSummaryViewPage) {
    setTimeout(() => {
      this.OtherViewEvent.emit(val);
    }, 280);
  }

  get reportTitle() {
    enum ReportTypeEnum {
      day = "日报表",
      week = "周报表",
      month = "月报表",
    }
    const sp = this.businessService.search.toSearchParam(),
      reportType = ReportTypeEnum[sp.TimeUnit],
      reportTitle = () => {
        var title = "";
        if (this.levelListPanel)
          title =
            this.dtp.nativeElement.value +
            " " +
            this.levelListPanel.selectedItem +
            " " +
            reportType;
        else if (
          this.businessManageService.viewDivisionType ==
          this.businessManageService.viewDivisionTypeEnum.City
        ) {
          const dropItem = this.businessService.search.divisionsDropList.find(
            (f) => f.id == sp.DivisionId
          );
          title =
            this.dtp.nativeElement.value +
            " " +
            dropItem.name +
            " " +
            reportType;
        }
        return title;
      };

    return {
      title: reportTitle(),
    };
  }

  exportCsv() {
    if (this.businessService.statisticTable.dataSource.values.length) {
      let csv = new StationSumHistoryCsv(),
        csvCt = new HWCsvContext(csv);
      csvCt.title = this.reportTitle.title;
      csvCt.fieldVal = this.businessService.statisticTable.dataSource.values;
      csvCt.export();
    }
  }

  exportExcel() {
    if (this.businessService.statisticTable.dataSource.values.length) {
      const xlsx = new StationSumHistoryXlsx(),
        xlsxCt = new HWXlsxContext(xlsx);
      xlsxCt.title = this.reportTitle.title;
      xlsxCt.fieldVal = this.businessService.statisticTable.dataSource.values;
      xlsxCt.export();
    }
  }
}
