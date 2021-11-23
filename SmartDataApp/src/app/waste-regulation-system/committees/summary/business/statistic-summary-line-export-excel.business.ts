import { StatisticSummaryLineChartViewModel } from "../charts/line-chart/statistic-summary-line-chart.model";
import { ExportTool, IExport } from "./statistic-summary-export-excel.business";

export class StatisticSummaryEventHistoryExportExcelBusiness
  implements IExport<StatisticSummaryLineChartViewModel>
{
  constructor(tool: ExportTool) {
    this.tool = tool;
  }
  data: StatisticSummaryLineChartViewModel;
  completed: boolean = false;
  tool: ExportTool;
  export(
    title: string,

    row: number
  ): number {
    try {
      row = this.tool.setTitle(this.data.title, row);
      let headers = ["时间点", ...this.data.xAxis];
      row = this.tool.setRow(headers, row);

      let values = ["数量", ...this.data.data];
      return this.tool.setRow(values, row);
    } catch (ex) {
      console.error(ex);
    } finally {
      this.completed = true;
    }
  }
}
