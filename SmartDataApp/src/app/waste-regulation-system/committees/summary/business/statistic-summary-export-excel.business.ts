import { HowellExcelJS } from "src/app/common/tool/hw-excel-js/hw-excel";
import { Language } from "src/app/common/tool/language";
import { EventType } from "src/app/data-core/model/enum";
import { StatisticSummaryEventRatioChartViewModel } from "../charts/event-ratio/statistic-summary-event-ratio-chart.model";
import { StatisticSummaryLineChartViewModel } from "../charts/line-chart/statistic-summary-line-chart.model";
import { StatisticSummaryStationEventChartViewModel } from "../charts/station-event/statistic-summary-station-event-chart.model";
import { StatisticSummaryTaskChartViewModel } from "../charts/task-statistic/statistic-summary-task-chart.model";
import { StatisticSummaryHeaderViewModel } from "../header/statistic-summary-header.model";
import { StatisticSummaryViewModel } from "../statistic-summary.model";
import { StatisticSummaryEventRatioExportExcelBusiness } from "./statistic-summary-event-ratio-export-excel.business";
import { StatisticSummaryHeaderExportExcelBusiness } from "./statistic-summary-header-export-excel.business";
import { StatisticSummaryEventHistoryExportExcelBusiness } from "./statistic-summary-line-export-excel.business";
import { StatisticSummaryStationsExportExcelBusiness } from "./statistic-summary-station-export-excel.business";
import { StatisticSummaryTaskExportExcelBusiness } from "./statistic-summary-task-export-excel.business";

export interface IExport<T> {
  data: T;
  tool: ExportTool;
  export(title: string, row: number): number;
  completed: boolean;
}

export class ExportTool {
  constructor(title: string) {
    this.excel = new HowellExcelJS();
    this.book = this.excel.createBook();
    this.sheet = this.excel.addWorksheet(this.book, title);
  }
  excel: HowellExcelJS;
  book: any;
  sheet: any;

  setCellValue(cellName: string, val: string | number) {
    this.excel.setCellValue(this.sheet, cellName, val);
  }

  getCellName(column: number, row: number) {
    let start = 65;
    let name = "";

    let codes = new Array();
    while (column >= 26) {
      column -= 26;
      codes.push(Math.floor(column / 26));
    }
    codes.push(column % 26);

    for (let i = 0; i < codes.length; i++) {
      name += String.fromCharCode(start + codes[i]);
    }

    return name + (row + 1);
  }

  setTitle(title: string, row: number) {
    this.excel.setCellValue(this.sheet, this.getCellName(0, row), title);
    return row + 1;
  }

  setRow(values: Array<string | number>, row: number = 0) {
    for (let i = 0; i < values.length; i++) {
      this.excel.setCellValue(this.sheet, this.getCellName(i, row), values[i]);
    }
    return row + 1;
  }
}

export class StatisticSummaryExportExcelBusiness {
  constructor(private title: string) {
    this.tool = new ExportTool(title);

    this.header = new StatisticSummaryHeaderExportExcelBusiness(this.tool);
    this.task = new StatisticSummaryTaskExportExcelBusiness(this.tool);
    this.eventRatio = new StatisticSummaryEventRatioExportExcelBusiness(
      this.tool
    );
    this.illegalDrop = new StatisticSummaryEventHistoryExportExcelBusiness(
      this.tool
    );
    this.mixedInto = new StatisticSummaryEventHistoryExportExcelBusiness(
      this.tool
    );
    this.stations = new StatisticSummaryStationsExportExcelBusiness(this.tool);
  }

  private tool: ExportTool;

  header: StatisticSummaryHeaderExportExcelBusiness;
  task: StatisticSummaryTaskExportExcelBusiness;
  eventRatio: StatisticSummaryEventRatioExportExcelBusiness;
  illegalDrop: StatisticSummaryEventHistoryExportExcelBusiness;
  mixedInto: StatisticSummaryEventHistoryExportExcelBusiness;
  stations: StatisticSummaryStationsExportExcelBusiness;

  get completed() {
    return (
      this.header.completed &&
      this.task.completed &&
      this.eventRatio.completed &&
      this.illegalDrop.completed &&
      this.mixedInto.completed &&
      this.stations.completed
    );
  }
  set completed(val: boolean) {
    this.header.completed =
      this.task.completed =
      this.eventRatio.completed =
      this.illegalDrop.completed =
      this.mixedInto.completed =
      this.stations.completed =
        val;
  }
  row = 0;

  get loaded() {
    return (
      this.header.data &&
      this.task.data &&
      this.eventRatio.data &&
      this.illegalDrop.data &&
      this.mixedInto.data &&
      this.stations.data
    );
  }

  export(
    data:
      | StatisticSummaryHeaderViewModel
      | StatisticSummaryTaskChartViewModel
      | StatisticSummaryEventRatioChartViewModel
      | StatisticSummaryLineChartViewModel
      | StatisticSummaryStationEventChartViewModel[],
    filename: string
  ) {
    if (data instanceof StatisticSummaryHeaderViewModel) {
      this.header.data = data;
    } else if (data instanceof StatisticSummaryTaskChartViewModel) {
      this.task.data = data;
    } else if (data instanceof StatisticSummaryEventRatioChartViewModel) {
      this.eventRatio.data = data;
    } else if (data instanceof StatisticSummaryLineChartViewModel) {
      switch (data.type) {
        case EventType.IllegalDrop:
          this.illegalDrop.data = data;
          break;
        case EventType.MixedInto:
          this.mixedInto.data = data;
          break;

        default:
          break;
      }
    } else if (data instanceof Array) {
      this.stations.data = data;
      // for (let i = 0; i < data.length; i++) {
      //   const item = data[i];
      //   if (item instanceof StatisticSummaryStationEventChartViewModel) {
      //   }
      // }
    } else {
    }

    if (this.loaded) {
      this.row = this.header.export(filename, this.row);
      this.row++;
      this.row = this.task.export("滞留任务处置", this.row);
      this.row++;
      this.row = this.eventRatio.export("事件占比", this.row);
      this.row++;
      this.row = this.illegalDrop.export(
        Language.EventType(EventType.IllegalDrop),
        this.row
      );
      this.row++;
      this.row = this.mixedInto.export(
        Language.EventType(EventType.MixedInto),
        this.row
      );
      this.row++;
      this.row = this.stations.export("投放点事件", this.row);
      this.writeFile(filename);
    }
  }

  writeFile(filename: string) {
    EventType.MixedInto;
    if (this.completed) {
      this.tool.excel.writeFile(this.tool.book, filename);
      this.completed = true;
    }
  }
}
