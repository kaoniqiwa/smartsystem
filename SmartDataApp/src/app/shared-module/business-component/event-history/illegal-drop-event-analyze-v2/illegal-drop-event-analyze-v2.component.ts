import { Component, OnInit, ViewChild, Input, Output, EventEmitter, ElementRef, } from '@angular/core';
import { BusinessService } from "./business/business.service";
import { DateTimePickerDirective } from "../../../../common/directive/date-time-picker.directive";
import { OtherViewEnum } from "../illegal-drop-event-summary/illegal-drop-event-summary.component";
import { DivisionDao } from "../../../../data-core/dao/division-dao";
import { GarbageStationDao } from "../../../../data-core/dao/garbage-station-dao";
import { ConfigRequestService } from "../../../../data-core/repuest/config.service";
import { HowellExcelV1 } from "../../../../common/tool/hw-excel-js/hw-excel-v1";
import { HowellExcelJS } from "../../../../common/tool/hw-excel-js/hw-excel";
import { BusinessEventTypeEnum } from '../business-event-type'; 
@Component({
  selector: 'hw-illegal-drop-event-analyze-v2',
  templateUrl: './illegal-drop-event-analyze-v2.component.html',
  styleUrls: ['./illegal-drop-event-analyze-v2.component.styl'],
  providers: [BusinessService, DivisionDao, GarbageStationDao]
})
export class IllegalDropEventAnalyzeV2Component implements OnInit {

  @Input() businessEventType = BusinessEventTypeEnum.IllegalDrop;

  @Output() OtherViewEvent = new EventEmitter<OtherViewEnum>();

  @ViewChild(DateTimePickerDirective)
  timePicker: DateTimePickerDirective;

  classText = '居委会';
  otherView = OtherViewEnum;

  @ViewChild('dtp')
  dtp: ElementRef;

  startDate = (b: Date) => {
    this.businessService.search.formBeginDate = b;
  }
  constructor(private businessService: BusinessService
    , private configRequestService: ConfigRequestService
    , private divisionDao: DivisionDao 
    , private garbageStationDao: GarbageStationDao) { }

  async ngOnInit() {
    this.businessService.businessEventType = this.businessEventType;
    this.divisionDao.allDivisions().then(x => this.businessService.divisions = x);
    this.garbageStationDao.allGarbageStations().then(x => this.businessService.garbageStations = x);

  }


  changeTimeType() {
    const val = this.businessService.changeDatePicker();
    this.timePicker.reInit(this.businessService.datePicker.startView
      , this.businessService.datePicker.minView
      , this.businessService.datePicker.formate, val.time, val.week);
    this.search();
  }

  search() {
    this.businessService.toDivisionIdsOrStationIds();
    this.businessService.requestData();
  }
  changeOtherView(val: OtherViewEnum) {

    this.OtherViewEvent.emit(val);
  }

  get pageTitle(){
    return  this.businessEventType == BusinessEventTypeEnum.IllegalDrop ? '乱丢垃圾' : '混合投放';
  }

  exportExcel() {
    if (this.businessService.dataSources) {
      const data = this.businessService.exportExcel(this.businessService.dataSources, this.businessService.search)
          , evenTypeLabel = this.pageTitle;
        const a = new HowellExcelJS();
        const b = a.createBook();
        const s = a.addWorksheet(b, 'Table');
        data.table.title = this.dtp.nativeElement.value + this.classText + evenTypeLabel + '总数据' + this.businessService.reportType;
        //data.chart.chartTitle = data.table.title;
        a.setCellValue(s, 'B1', data.table.title);
        a.setCellValue(s, 'A2', data.table.fieldName[0]);
        a.setCellValue(s, 'B2', data.table.fieldName[1]);
        a.setCellValue(s, 'C2', data.table.fieldName[2]);

        var i = 3;
        data.table.data.map(x => {
          a.setCellValue(s, 'A' + i + '', x.no);
          a.setCellValue(s, 'B' + i + '', x.name);
          a.setCellValue(s, 'C' + i + '', x.val);
          i += 1;
        });

        a.writeFile(b, data.table.title);
      // this.configRequestService.xls('bar.xlsx').subscribe((x) => {
        
      // })
    }
  }
}