import { HowellExcelJS } from "src/app/common/tool/hw-excel-js/hw-excel";
import { StatisticSummaryHeaderViewModel } from "../header/statistic-summary-header.model";
import { ExportTool, IExport } from "./statistic-summary-export-excel.business";

export class StatisticSummaryHeaderExportExcelBusiness
  implements IExport<StatisticSummaryHeaderViewModel>
{
  constructor(tool: ExportTool) {
    this.tool = tool;
  }
  data: StatisticSummaryHeaderViewModel;
  completed = false;
  tool: ExportTool;
  export(title: string, row: number) {
    try {
      row = this.tool.setTitle(title, row);
      row++;
      let headers = [
        "垃圾处置达标率",
        "垃圾滞留处置率",
        "最大垃圾滞留时长",
        "乱丢垃圾总数量",
        "混合投放总数量",
      ];
      row = this.tool.setRow(headers, row);

      let time = "";
      if (this.data.GarbageTimeHour) {
        time += `${this.data.GarbageTimeHour}小时`;
      }
      if (this.data.GarbageTimeMinute) {
        time += `${this.data.GarbageTimeMinute}分钟`;
      }
      if (!time) {
        time = "0分钟";
      }

      let values = [
        `${this.data.Garde}分`,
        `${this.data.GarbageHandleRatio}%`,
        time,
        `${this.data.IllegalDrop}起`,
        `${this.data.MixedInto}起`,
      ];
      return this.tool.setRow(values, row);
    } catch (ex) {
      console.error(ex);
    } finally {
      this.completed = true;
    }
  }
}
