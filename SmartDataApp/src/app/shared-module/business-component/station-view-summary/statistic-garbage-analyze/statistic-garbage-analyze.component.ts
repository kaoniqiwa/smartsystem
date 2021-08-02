import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  ElementRef,
} from "@angular/core";
import { BusinessService } from "./business/business.service";
import { DateTimePickerDirective } from "../../../../common/directive/date-time-picker.directive";
import { GarbageStationDao } from "../../../../data-core/dao/garbage-station-dao";
import { TreeDropListComponent } from "../../event-history/illegal-drop-event-analyze/tree-drop-list/tree-drop-list.component";
import { MessageBar } from "../../../../common/tool/message-bar";
import { ConfigRequestService } from "../../../../data-core/repuest/config.service";
import { HowellExcelV1 } from "../../../../common/tool/hw-excel-js/hw-excel-v1";
import { HowellExcelJS } from "../../../../common/tool/hw-excel-js/hw-excel";
import { HowellCSV } from "../../../../common/tool/hw-excel-js/hw-csv";
import { TITLEKEY, COLNAME } from "../../../../common/tool/hw-excel-js/data";
import { OtherViewEnum } from "../view-helper";
@Component({
  selector: "hw-statistic-garbage-analyze",
  templateUrl: "./statistic-garbage-analyze.component.html",
  styleUrls: ["./statistic-garbage-analyze.component.styl"],
  providers: [BusinessService, GarbageStationDao],
})
export class StatisticGarbageAnalyzeComponent implements OnInit {
  @Output() OtherViewEvent = new EventEmitter<OtherViewEnum>();

  @ViewChild(DateTimePickerDirective)
  timePicker: DateTimePickerDirective;
  @ViewChild(TreeDropListComponent)
  dropList: TreeDropListComponent;

  otherView = OtherViewEnum;

  @ViewChild("dtp")
  dtp: ElementRef;

  startDate = (b: Date) => {
    this.businessService.search.formBeginDate = b;
  };
  constructor(
    private businessService: BusinessService,
    private configRequestService: ConfigRequestService
  ) {}

  ngOnInit() {}

  initChart() {
    this.changeTimeType();
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

  changeClassType() {
    this.search();
  }

  search() {
    const ids = new Array<string>();
    this.dropList.selectedTexts.map((x) => ids.push(x.id));
    if (ids.length < 6 && ids.length > 0) {
      this.businessService.search.stationId = ids;

      this.businessService.requestData();
    } else if (ids.length > 5) MessageBar.response_warning("最大5个对象");
  }

  exportExcel() {
    if (this.businessService.dataSource) {
      const data = this.businessService.exportExcel(
        this.businessService.dataSource,
        this.businessService.search
      );
      this.configRequestService.xls("column.xlsx").subscribe(async (x) => {
        const a = new HowellExcelJS();
        const b = a.createBook();
        const s = a.addWorksheet(b, "Table"),
          colName = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
        var i = 3,
          c = 3,
          timeTag = 0,
          className = "";
        this.dropList.selectedTexts.map((x) => (className += " " + x.text));
        data.table.title = `${this.dtp.nativeElement.value} ${className} ${data.categoryName}${this.businessService.reportType} 单位(${data.dataUnit})`;
        data.chart.titles = [data.table.title];
        data.chart.chartTitle = data.table.title;
        a.setCellValue(s, "B1", data.table.title);

        data.table.fieldName.map((v, i) => {
          a.setCellValue(s, colName[i] + "2", v);
        });

        for (const k of data.table.data.keys()) {
          const field = data.table.data.get(k);
          field.map((x) => {
            if (timeTag == 0) {
              a.setCellValue(s, "A" + i + "", x.no);
              a.setCellValue(s, "B" + i + "", x.date);
              a.setCellValue(s, "C" + i + "", x.name);
            }
            a.setCellValue(s, colName[c] + i, x.val);
            i += 1;
          });

          c += 1;
          i = 3;
          timeTag = 1;
        }

        let he = new HowellExcelV1(data.chart);
        he.loadZip(x);
        var sheetArr: any;
        /**图表 数据 */
        he.read({ file: "xl/worksheets/sheet1.xml" }, (err: any, o: any) => {
          sheetArr = {
            $: o.worksheet.$,
            sheetViews: o.worksheet.sheetViews,
            drawing: o.worksheet.drawing,
          };
        });
        a.getBuffer(b, (buffer) => {
          he.generate(buffer, data.table.title, 2, 4, true, sheetArr);
        });
      });
    }
  }

  exportCSV() {
    if (this.businessService.dataSource) {
      const data = this.businessService.exportExcel(
          this.businessService.dataSource,
          this.businessService.search
        ),
        csvDataMap = new Map<string, Array<string>>(),
        findKeyNum = (findKey: string) => {
          const numArr = new Array();
          for (const k of data.table.data.keys()) {
            const field = data.table.data.get(k);
            field.map((f) => {
              if (f.name == findKey) numArr.push(f.val || 0);
            });
          }
          return numArr;
        };
      var className = "",
        tag = 0;
      this.dropList.selectedTexts.map((x) => (className += " " + x.text));
      data.table.title = `${this.dtp.nativeElement.value} ${className} ${data.categoryName}${this.businessService.reportType} 单位(${data.dataUnit})`;
      csvDataMap.set(TITLEKEY, [data.table.title]);
      csvDataMap.set(COLNAME, data.table.fieldName);
      for (const k of data.table.data.keys()) {
        const field = data.table.data.get(k);
        field.map((x) => {
          csvDataMap.set(tag + "", [
            x.no + "",
            x.date,
            x.name,
            ...findKeyNum(x.name),
          ]);
          tag += 1;
        });
        break;
      }

      new HowellCSV(csvDataMap).writeCsvFile(data.table.title);
    }
  }

  changeOtherView(val: OtherViewEnum) {
    setTimeout(() => {
      this.OtherViewEvent.emit(val);
    }, 280);
  }
}
