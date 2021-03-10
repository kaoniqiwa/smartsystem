import { Component, OnInit, ViewChild, Output, EventEmitter, ElementRef, } from '@angular/core';
import { BusinessService, } from "./business/business.service";
import { TimeUnitEnum } from "./business/search";
import { TableField, FieldDesc } from "./business/statistic-table";
import { DateTimePickerDirective } from "../../../../common/directive/date-time-picker.directive";
import { GarbageStationDao } from "../../../../data-core/dao/garbage-station-dao";
import { DivisionDao } from "../../../../data-core/dao/division-dao";
import { LevelListPanelComponent } from "../level-list-panel/level-list-panel.component";
import { DivisionTypeEnum } from "../../../../common/tool/enum-helper";
import { HowellExcelJS } from "../../../../common/tool/hw-excel-js/hw-excel";
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
    , private garbageStationDao: GarbageStationDao) { }

  async ngOnInit() {

  }

  initView() {
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

  exportExcel() {
    if (this.businessService.statisticTable.dataSource.values.length) {
      enum ReportTypeEnum {
        day='日报表',
        week='周报表',
        month='月报表'
      }
      const sp = this.businessService.search.toSearchParam()  
        , excel = new HowellExcelJS()
        , book = excel.createBook()
        , reportType = ReportTypeEnum[sp.TimeUnit]
        , reportTitle = this.dtp.nativeElement.value + ' ' + this.levelListPanel.selectedItem + ' ' + reportType
        , sheet = excel.addWorksheet(book, reportTitle)
        , colName = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
        , fieldName = ['序号', '名称', '评分', '平均落地时长', '最大落地时长', '总落地时长', '乱扔垃圾', '混合投放']
        , toCellValue = (fieldStr: string) => {
          const field: FieldDesc = JSON.parse(fieldStr);
          var value = '';
          if(field.tdVal == '0')
             return '0';
          else{           
            value += field.tdVal;
            value += field.iconClass.indexOf('up') > -1 ? ('↑' + field.label) : ('↓' + field.label);
          }
          return value;
        };
      var no = 1, tag = 3;
      excel.setCellValue(sheet, 'A1', reportTitle);
      for (let i = 0; i < fieldName.length; i++)
        excel.setCellValue(sheet, colName[i] + '2', fieldName[i]);

      this.businessService.statisticTable.dataSource.values.map((v: TableField) => {     
        if (v.garbageRatio) {
          excel.setCellValue(sheet, colName[0] + (tag + ''), no);
          excel.setCellValue(sheet, colName[1] + (tag  + ''), v.name);
          excel.setCellValue(sheet, colName[2] + (tag + ''), toCellValue(v.garbageRatio));
          excel.setCellValue(sheet, colName[3] + (tag  + ''), toCellValue(v.avgGarbageTime));
          excel.setCellValue(sheet, colName[4] + (tag  + ''), toCellValue(v.maxGarbageTime));
          excel.setCellValue(sheet, colName[5] + (tag  + ''), toCellValue(v.garbageDuration));
          excel.setCellValue(sheet, colName[6] + (tag  + ''), toCellValue(v.illegalDrop));
          excel.setCellValue(sheet, colName[7] + (tag  + ''), toCellValue(v.mixedInto));
          no+=1;
          tag+=1;
        }

      });

      excel.writeFile(book, reportTitle);
    }

  }

}

export enum OtherViewEnum {
  chart,
  info,
  sumChart,
  analyzeChart
}
