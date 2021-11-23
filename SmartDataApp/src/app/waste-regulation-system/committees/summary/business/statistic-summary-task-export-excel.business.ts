import { StatisticSummaryTaskChartViewModel } from "../charts/task-statistic/statistic-summary-task-chart.model";
import { ExportTool, IExport } from "./statistic-summary-export-excel.business";

export class StatisticSummaryTaskExportExcelBusiness
  implements IExport<StatisticSummaryTaskChartViewModel>
{
  constructor(tool: ExportTool) {
    this.tool = tool;
  }
  data: StatisticSummaryTaskChartViewModel;
  completed: boolean = false;
  tool: ExportTool;
  export(title: string, row: number): number {
    try {
      row = this.tool.setTitle(title, row);

      let headers = ["处置率", "发布任务数", "超时任务数", "未完成任务数"];
      row = this.tool.setRow(headers, row);

      let values = [
        `${this.data.ratio}%`,
        `${this.data.TotalCount}起`,
        `${this.data.GarbageTimeoutCount}起`,
        `${this.data.UncompletedCount}起`,
      ];
      return this.tool.setRow(values, row);
    } catch (ex) {
      console.error(ex);
    } finally {
      this.completed = true;
    }
  }
}
