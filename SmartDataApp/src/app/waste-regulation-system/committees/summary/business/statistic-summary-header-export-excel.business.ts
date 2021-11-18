import { StatisticSummaryHeaderViewModel } from "../header/statistic-summary-header.model";
import { ExportTool, IExport } from "./statistic-summary-export-excel.business";

export class StatisticSummaryHeaderExportExcelBusiness
  implements IExport<StatisticSummaryHeaderViewModel>
{
  constructor(tool: ExportTool) {
    this.tool = tool;
  }
  completed = false;
  tool: ExportTool;
  export(title: string, data: StatisticSummaryHeaderViewModel) {
    let sheet = this.tool.excel.addWorksheet(this.tool.book, title);
    this.tool.excel.setCellValue(
      sheet,
      this.tool.getCellName(0, 0),
      "垃圾处置达标率"
    );
    this.tool.excel.setCellValue(
      sheet,
      this.tool.getCellName(0, 1),
      `${data.Garde}分`
    );

    this.tool.excel.setCellValue(
      sheet,
      this.tool.getCellName(1, 0),
      "垃圾滞留处置率"
    );
    this.tool.excel.setCellValue(
      sheet,
      this.tool.getCellName(1, 1),
      `${data.GarbageHandleRatio}%`
    );

    this.tool.excel.setCellValue(
      sheet,
      this.tool.getCellName(2, 0),
      "最大垃圾滞留时长"
    );
    this.tool.excel.setCellValue(
      sheet,
      this.tool.getCellName(2, 1),
      `${data.GarbageTimeHour}分`
    );

    this.tool.excel.setCellValue(
      sheet,
      this.tool.getCellName(3, 0),
      "乱丢垃圾总数量"
    );
    this.tool.excel.setCellValue(
      sheet,
      this.tool.getCellName(3, 1),
      `${data.IllegalDrop}起`
    );

    this.tool.excel.setCellValue(
      sheet,
      this.tool.getCellName(4, 0),
      "混合投放总数量"
    );
    this.tool.excel.setCellValue(
      sheet,
      this.tool.getCellName(4, 1),
      `${data.MixedInto}起`
    );
    this.completed = true;
  }
}
