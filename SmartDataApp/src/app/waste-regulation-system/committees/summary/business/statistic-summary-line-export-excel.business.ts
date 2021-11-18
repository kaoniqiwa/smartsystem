import { StatisticSummaryLineChartViewModel } from "../charts/line-chart/statistic-summary-line-chart.model";
import { ExportTool, IExport } from "./statistic-summary-export-excel.business";

export class StatisticSummaryEventHistoryExportExcelBusiness
  implements IExport<StatisticSummaryLineChartViewModel>
{
  constructor(tool: ExportTool) {
    this.tool = tool;
  }
  completed: boolean = false;
  tool: ExportTool;
  export(title: string, data: StatisticSummaryLineChartViewModel): void {
    let sheet = this.tool.excel.addWorksheet(this.tool.book, data.title);

    this.tool.excel.setCellValue(sheet, this.tool.getCellName(0, 0), "时间点");
    this.tool.excel.setCellValue(sheet, this.tool.getCellName(1, 0), "次数");

    let startRow = 1;
    for (let i = 0; i < data.xAxis.length; i++) {
      const xAxis = data.xAxis[i];
      this.tool.excel.setCellValue(
        sheet,
        this.tool.getCellName(0, i + startRow),
        xAxis
      );
    }
    for (let i = 0; i < data.data.length; i++) {
      const item = data.data[i];
      this.tool.excel.setCellValue(
        sheet,
        this.tool.getCellName(1, i + startRow),
        item
      );
    }

    this.completed = true;
  }
}
