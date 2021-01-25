import { Component, OnInit, ViewChild, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { BusinessService } from "./business/business.service";
import { DateTimePickerDirective } from "../../../../common/directive/date-time-picker.directive";
import { TreeDropListComponent } from "./tree-drop-list/tree-drop-list.component";
import { MessageBar } from "../../../../common/tool/message-bar";
import { OtherViewEnum } from "../illegal-drop-event-summary/illegal-drop-event-summary.component";
import { ConfigRequestService } from "../../../../data-core/repuest/config.service";
import { DivisionBusinessService } from "../../../../waste-regulation-system/index/business-card-grid/division-business.service";
import { HowellExcelV1 } from "../../../../common/tool/hw-excel-js/hw-excel-v1";
import { HowellExcelJS } from "../../../../common/tool/hw-excel-js/hw-excel";
@Component({
  selector: 'hw-illegal-drop-event-analyze',
  templateUrl: './illegal-drop-event-analyze.component.html',
  styleUrls: ['./illegal-drop-event-analyze.component.styl'],
  providers: [BusinessService]
})
export class IllegalDropEventAnalyzeComponent implements OnInit {
  @Output() OtherViewEvent = new EventEmitter<OtherViewEnum>();
  @Input() changeViewFn: (index: number) => void;
  @ViewChild(DateTimePickerDirective)
  timePicker: DateTimePickerDirective;

  @ViewChild(TreeDropListComponent)
  dropList: TreeDropListComponent;

  @ViewChild('dtp')
  dtp: ElementRef;

  @Input() isDefaultSearch = false;

  classText = '居委会';
  otherView = OtherViewEnum;

  startDate = (b: Date) => {
    this.businessService.search.formBeginDate = b;
  }
  constructor(private businessService: BusinessService
    , private configRequestService: ConfigRequestService
    , private divisionBusinessService: DivisionBusinessService) { }

  async ngOnInit() {

    setTimeout(() => {
      if (this.isDefaultSearch && this.divisionBusinessService.divisionsId) this.defaultSearch = this.divisionBusinessService.divisionsId;
    }, 1200);
  }

  changeView(tagIndex: number) {
    this.changeViewFn(tagIndex);
  }

  set defaultSearch(id: string) {
    this.dropList.defaultSearch = id;
  }

  changeClassType() {
    this.dropList.clearSelectedTexts();
    this.businessService.changeClassType((val: boolean) => {
      this.dropList.onlyDivisionNode = val;
      this.classText = val ? '居委会' : '垃圾房';
      this.dropList.r();
      this.dropList.reInit();
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
    const ids = new Array<string>();
    this.dropList.selectedTexts.map(x => ids.push(x.id));
    if (ids.length <= 3 && ids.length > 0) {
      this.businessService.toDivisionIdsOrStationIds(ids);
      this.businessService.requestData(this.dropList.selectedTexts);
    }
    else if (ids.length > 3)
      new MessageBar().response_warning('最大3个对象');
  }
  changeOtherView(val: OtherViewEnum) {
    setTimeout(() => {
      this.OtherViewEvent.emit(val);
    }, 50);

  }

  exportExcel() {
    if (this.businessService.dataSources) {


      const data = this.businessService.exportExcel(this.businessService.dataSources, this.businessService.search, this.dropList.selectedTexts);
      this.configRequestService.xls('column.xlsx').subscribe(async (x) => {

        const a = new HowellExcelJS();
        const b = a.createBook();
        const s = a.addWorksheet(b, 'Table'), colName = ['A', 'B', 'C', 'D', 'E'];
        var i = 3, c = 3, timeTag = 0, className = '', sum = 0;
        this.dropList.selectedTexts.map(x => className += ' ' + x.text);
        data.table.title = `${this.dtp.nativeElement.value} ${className}数据比较${this.businessService.reportType}`;
        data.chart.titles = [data.table.title];
        data.chart.chartTitle = data.table.title;
        a.setCellValue(s, 'B1', data.table.title);

        data.table.fieldName.map((v, i) => {
          a.setCellValue(s, colName[i] + '2', v);
        });

        for (const k of data.table.data.keys()) {
          const field = data.table.data.get(k);
          field.map(x => {
            if (timeTag == 0) {
              a.setCellValue(s, 'A' + i + '', x.no);
              a.setCellValue(s, 'B' + i + '', x.date);
              a.setCellValue(s, 'C' + i + '', x.name);
              a.setCellValue(s, 'A' + (3 + field.length) + '', '合计')
            }
            a.setCellValue(s, colName[c] + i, x.val);
            i += 1;
            sum += x.val;
          });
          a.setCellValue(s, colName[c] + i, sum);
          c += 1;
          i = 3;
          sum = 0;
          timeTag = 1;
        }

        let he = new HowellExcelV1(data.chart);
        he.loadZip(x);
        var sheetArr: any;
        /**图表 数据 */
        he.read({ file: 'xl/worksheets/sheet1.xml' }, (err: any, o: any) => {
          sheetArr = { $: o.worksheet.$, sheetViews: o.worksheet.sheetViews, drawing: o.worksheet.drawing };
        });
        a.getBuffer(b, (buffer) => {

          he.generate(buffer, data.table.title, 2, 4, true, sheetArr);
        });
      })
    }
  }
}
