import { HowellExcelJS } from "src/app/common/tool/hw-excel-js/hw-excel";
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
  tool: ExportTool;
  export(title: string, data: T): void;
  completed: boolean;
}

export class ExportTool {
  excel = new HowellExcelJS();
  book = this.excel.createBook();

  getCellName(colum: number, row: number) {
    let start = 65;

    return String.fromCharCode(start + colum) + (row + 1);
  }
}

export class StatisticSummaryExportExcelBusiness {
  constructor() {
    this.tool = new ExportTool();
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

  writeFile(filename: string) {
    EventType.MixedInto;
    if (this.completed) {
      this.tool.excel.writeFile(this.tool.book, filename);
      this.completed = true;
    }
  }
}
