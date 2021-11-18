import { StatisticSummaryTaskChartViewModel } from "../charts/task-statistic/statistic-summary-task-chart.model";
import { ExportTool, IExport } from "./statistic-summary-export-excel.business";

export class StatisticSummaryTaskExportExcelBusiness
  implements IExport<StatisticSummaryTaskChartViewModel>
{
  constructor(tool: ExportTool) {
    this.tool = tool;
  }
  completed: boolean = false;
  tool: ExportTool;
  export(title: string, data: StatisticSummaryTaskChartViewModel): void {
    let sheet = this.tool.excel.addWorksheet(this.tool.book, title);

    this.tool.excel.setCellValue(sheet, this.tool.getCellName(0, 0), "处置率");
    this.tool.excel.setCellValue(
      sheet,
      this.tool.getCellName(0, 1),
      `${data.ratio}%`
    );

    this.tool.excel.setCellValue(
      sheet,
      this.tool.getCellName(1, 0),
      "发布任务数"
    );
    this.tool.excel.setCellValue(
      sheet,
      this.tool.getCellName(1, 1),
      `${data.TotalCount}起`
    );

    this.tool.excel.setCellValue(
      sheet,
      this.tool.getCellName(2, 0),
      "超时任务数"
    );
    this.tool.excel.setCellValue(
      sheet,
      this.tool.getCellName(2, 1),
      `${data.GarbageTimeoutCount}起`
    );

    this.tool.excel.setCellValue(
      sheet,
      this.tool.getCellName(3, 0),
      "未完成任务数"
    );
    this.tool.excel.setCellValue(
      sheet,
      this.tool.getCellName(3, 1),
      `${data.UncompletedCount}起`
    );
    this.completed = true;
  }
}
