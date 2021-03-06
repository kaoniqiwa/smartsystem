import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ChangeDetectorRef,
  AfterViewInit,
} from "@angular/core";
import { BusinessService } from "./business/business.service";
import { DivisionBusinessService } from "../../../../waste-regulation-system/index/business-card-grid/division-business.service";
import { DateTimePickerDirective } from "../../../../common/directive/date-time-picker.directive";
import { LevelListPanelComponent } from "../level-list-panel/level-list-panel.component";
import { OtherViewEnum } from "../illegal-drop-event-summary/illegal-drop-event-summary.component";
import { ConfigRequestService } from "../../../../data-core/repuest/config.service";
import { HowellExcelV1 } from "../../../../common/tool/hw-excel-js/hw-excel-v1";
import { HowellExcelJS } from "../../../../common/tool/hw-excel-js/hw-excel";
import { HowellCSV } from "../../../../common/tool/hw-excel-js/hw-csv";
import { TITLEKEY, COLNAME } from "../../../../common/tool/hw-excel-js/data";
import { EventType } from "src/app/data-core/model/enum";
import { Language } from "src/app/common/tool/language";
@Component({
  selector: "hw-illegal-drop-event-chart",
  templateUrl: "./illegal-drop-event-chart.component.html",
  styleUrls: ["./illegal-drop-event-chart.component.styl"],
  providers: [BusinessService],
})
export class IllegalDropEventChartComponent implements OnInit, AfterViewInit {
  otherView = OtherViewEnum;
  @Input() businessEventType = EventType.IllegalDrop;
  @Input() changeViewFn: (index: number) => void;
  @Input() isDefaultSearch = false;
  @Output() OtherViewEvent = new EventEmitter<OtherViewEnum>();
  changeView(tagIndex: number) {
    this.changeViewFn(tagIndex);
  }
  @ViewChild(DateTimePickerDirective)
  timePicker: DateTimePickerDirective;

  @ViewChild(LevelListPanelComponent)
  levelListPanelComponent: LevelListPanelComponent;

  @ViewChild("dtp")
  dtp: ElementRef;

  changeDivisionFn = (id: string) => {
    if (id && this.businessService.garbageStations) {
      const filter = this.businessService.garbageStations.filter(
        (x) => x.DivisionId == id
      );
      this.businessService.search.toStationsDropList(filter);
      this.businessService.search.divisionId = id;
      this.businessService.search.stationId = "";
    } else if (id == "") {
      this.businessService.search.toStationsDropList(
        this.businessService.garbageStations
      );

      this.businessService.search.stationId = id;
    }
  };
  startDate = (b: Date) => {
    this.businessService.search.formBeginDate = b;
  };
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private businessService: BusinessService,
    private configRequestService: ConfigRequestService,
    private divisionBusinessService: DivisionBusinessService
  ) {}
  ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges();
  }

  get pageTitle() {
    return this.businessEventType == EventType.IllegalDrop
      ? Language.json.EventType.IllegalDrop
      : Language.json.EventType.MixedInto;
  }

  async ngOnInit() {
    this.businessService.businessEventType = this.businessEventType;
    this.businessService.divisions =
      await this.businessService.divisionDao.allDivisions();
    this.businessService.garbageStations =
      await this.businessService.garbageStationDao.allGarbageStations();

    this.businessService.search.toStationsDropList(
      this.businessService.garbageStations
    );

    this.businessService.initDivisionListView();

    this.divisionBusinessService.illegalDropChartDefault.subscribe((id) => {
      this.levelListPanelComponent.defaultItem(id);
      this.search();
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
    this.businessService.resetChartType();
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

  get paramTextId() {
    var param: { id: string; text: string };
    const s = this.businessService.search.toSearchParam();
    if (s.StationId) {
      const find = this.businessService.garbageStations.find(
        (x) => x.Id == s.StationId
      );
      param = {
        id: find.Id,
        text: find.Name,
      };
    } else if (s.DivisionId) {
      const find = this.businessService.divisions.find(
        (x) => x.Id == s.DivisionId
      );
      param = {
        id: find.Id,
        text: find.Name,
      };
    }
    return param;
  }

  exportCSV() {
    if (this.businessService.dataSources) {
      const data = this.businessService.exportExcel(
        this.businessService.dataSources,
        this.businessService.search,
        [this.paramTextId]
      );

      const evenTypeLabel = this.pageTitle,
        csvDataMap = new Map<string, Array<string>>();
      var sum = 0;

      data.table.title = `${this.dtp.nativeElement.value} ${this.paramTextId.text}${evenTypeLabel}${this.businessService.reportType}`;
      data.chart.titles = [data.table.title];

      csvDataMap.set(TITLEKEY, [data.table.title]);
      csvDataMap.set(COLNAME, data.table.fieldName);
      for (const k of data.table.data.keys()) {
        const field = data.table.data.get(k);
        field.map((x) => {
          csvDataMap.set(x.no + "", [
            x.no + "",
            x.date,
            x.name,
            (x.val === undefined ? "" : x.val || 0) + "",
          ]);
          sum += x.val || 0;
        });
        csvDataMap.set("sum", ["??????", "", "", sum + ""]);
        sum = 0;
      }
      new HowellCSV(csvDataMap).writeCsvFile(data.table.title);
    }
  }

  exportExcel() {
    if (this.businessService.dataSources) {
      const data = this.businessService.exportExcel(
        this.businessService.dataSources,
        this.businessService.search,
        [this.paramTextId]
      );
      this.configRequestService.xls("column.xlsx").subscribe(async (x) => {
        const a = new HowellExcelJS();
        const b = a.createBook();
        const s = a.addWorksheet(b, "Table"),
          colName = ["A", "B", "C", "D", "E", "F", "G", "H"],
          evenTypeLabel = this.pageTitle;
        var i = 3,
          c = 3,
          timeTag = 0,
          sum = 0;

        data.table.title = `${this.dtp.nativeElement.value} ${this.paramTextId.text}${evenTypeLabel}${this.businessService.reportType}`;
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
              a.setCellValue(s, "A" + (3 + field.length) + "", "??????");
            }
            a.setCellValue(s, colName[c] + i, x.val);
            i += 1;
            sum += x.val || 0;
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
        /**?????? ?????? */
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
}
