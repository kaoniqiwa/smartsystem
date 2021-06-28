import { Component, OnInit, ViewChild, Output, EventEmitter, ElementRef, } from '@angular/core';
import { BusinessService, } from "./business/business.service";
import { DateTimePickerDirective } from "../../../../common/directive/date-time-picker.directive";
import { GarbageStationDao } from "../../../../data-core/dao/garbage-station-dao";
import { DivisionDao } from "../../../../data-core/dao/division-dao";
import { LevelListPanelComponent } from "../../event-history/level-list-panel/level-list-panel.component";
import { DivisionTypeEnum } from "../../../../common/tool/enum-helper";
import { BusinessManageService, ViewDivisionTypeEnum } from "../../business-manage-service";
import { OtherViewEnum } from "../view-helper";
import { HWCsvContext, StationSumHistoryCsv } from "../../export-csv-file";
import { HWXlsxContext, StationSumHistoryXlsx } from "../../export-xlsx-file";
@Component({
  selector: 'hw-garbage-full-history-sum-chart',
  templateUrl: './garbage-full-history-sum-chart.component.html',
  styleUrls: ['./garbage-full-history-sum-chart.component.styl'],
  providers: [BusinessService, GarbageStationDao, DivisionDao]
})
export class GarbageFullHistorySumChartComponent implements OnInit {

  @Output() OtherViewEvent = new EventEmitter<OtherViewEnum>();

  @ViewChild(DateTimePickerDirective)
  timePicker: DateTimePickerDirective;

  @ViewChild(LevelListPanelComponent)
  levelListPanel: LevelListPanelComponent;

  otherView = OtherViewEnum;

  @ViewChild('dtp')
  dtp: ElementRef;

  startDate = (b: Date) => {
    this.businessService.search.formBeginDate = b;
    this.businessService.requestData();
  }
  changeDivisionFn = (id: string) => {
    const county = this.businessService.divisions.find(d => d.DivisionType == DivisionTypeEnum.County && d.Id == id);
    if (id && this.businessService.garbageStations && county == null) {
      const filter = this.businessService.garbageStations.filter(x => x.DivisionId == id);
      const ids = new Array<string>();
      filter.map(c => ids.push(c.Id));
      this.businessService.search.stationId = ids;
    }
    else if (county) {
      const ids = new Array<string>();
      this.businessService.garbageStations.map(c => ids.push(c.Id));
      this.businessService.search.stationId = ids;

    }
    this.businessService.requestData();
  }

  constructor(private businessService: BusinessService
    , private divisionDao: DivisionDao
    , private businessManageService: BusinessManageService
    , private garbageStationDao: GarbageStationDao) { }

  async ngOnInit() {

  }

  async initView() {
    const divisions = await this.businessManageService.getParentDivision();
    this.businessManageService.divisionType(divisions.pop());

    if (this.businessManageService.viewDivisionType == ViewDivisionTypeEnum.City) {
      this.businessManageService.getchildrenDivision().then(c => {
        this.businessService.search.toDivisionsDropList = c.filter(f => f.DivisionType == DivisionTypeEnum.County);
        if (this.businessService.search.divisionsDropList.length) {
          this.businessService.search.divisionId = this.businessService.search.divisionsDropList[0].id;
          this.changeDivision(this.businessService.search.divisionsDropList[0].id);
        }
      });

    }
    else {
      this.garbageStationDao.allGarbageStations().then(stations => {
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
      this.divisionDao.allDivisions().then(divisions => {
        this.businessService.divisions = divisions;
        this.businessService.initDivisionListView();
        const county = divisions.find(d => d.DivisionType == DivisionTypeEnum.County);
        setTimeout(() => {
          if (county) {
            this.levelListPanel.defaultItem(county.Id);
          }

        }, 50);

      });
    }

  }

  changeDivision(id: string) {
    const ids = new Array<string>();
    this.businessManageService.getGarbageStations(id).then(items => {
      console.log(items);

      items.map(i => ids.push(i.Id));
      this.businessService.search.stationId = ids;
    });
  }

  changeTimeType() {
    const val = this.businessService.changeDatePicker();
    this.timePicker.reInit(this.businessService.datePicker.startView
      , this.businessService.datePicker.minView
      , this.businessService.datePicker.formate, val.time, val.week);
    this.search();
  }

  search() {
    this.businessService.requestData();
  }

  changeOtherView(val: OtherViewEnum) {
    setTimeout(() => {
      this.OtherViewEvent.emit(val);
    }, 280);
  }

  get reportTitle() {
    enum ReportTypeEnum {
      day = '日报表',
      week = '周报表',
      month = '月报表'
    }
    const sp = this.businessService.search.toSearchParam()
      , reportType = ReportTypeEnum[sp.TimeUnit]
      , reportTitle = () => {
        var title = '';
        if (this.levelListPanel)
          title = this.dtp.nativeElement.value + ' ' + this.levelListPanel.selectedItem + ' ' + reportType;
        else if (this.businessManageService.viewDivisionType == this.businessManageService.viewDivisionTypeEnum.City) {
          const dropItem = this.businessService.search.divisionsDropList.find(f => f.id == sp.DivisionId);
          title = this.dtp.nativeElement.value + ' ' + dropItem.name + ' ' + reportType;
        }
        return title;
      }

    return {
      title: reportTitle()
    }
  }

  exportCsv() {
    if (this.businessService.statisticTable.dataSource.values.length) {
      let csv = new StationSumHistoryCsv()
        , csvCt = new HWCsvContext(csv);
      csvCt.title = this.reportTitle.title;
      csvCt.fieldVal = this.businessService.statisticTable.dataSource.values;
      csvCt.export();
    }
  }

  exportExcel() {
    if (this.businessService.statisticTable.dataSource.values.length) {
      const xlsx = new StationSumHistoryXlsx()
        , xlsxCt = new HWXlsxContext(xlsx);
      xlsxCt.title = this.reportTitle.title;
      xlsxCt.fieldVal = this.businessService.statisticTable.dataSource.values;
      xlsxCt.export();
    }
  }

}
