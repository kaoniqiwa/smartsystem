import { Language } from "src/app/common/tool/language";
import { EventType } from "src/app/data-core/model/enum";
import { StatisticSummaryEventRatioChartViewModel } from "../charts/event-ratio/statistic-summary-event-ratio-chart.model";

import { ExportTool, IExport } from "./statistic-summary-export-excel.business";

export class StatisticSummaryEventRatioExportExcelBusiness
  implements IExport<StatisticSummaryEventRatioChartViewModel>
{
  constructor(tool: ExportTool) {
    this.tool = tool;
  }
  completed: boolean = false;
  tool: ExportTool;
  export(title: string, data: StatisticSummaryEventRatioChartViewModel): void {
    let count = data.MixedInto + data.GarbageFull + data.IllegalDrop;

    let sheet = this.tool.excel.addWorksheet(this.tool.book, title);

    this.tool.excel.setCellValue(sheet, this.tool.getCellName(0, 1), "数量");
    this.tool.excel.setCellValue(sheet, this.tool.getCellName(0, 2), "占比");

    this.tool.excel.setCellValue(
      sheet,
      this.tool.getCellName(1, 0),
      Language.EventType(EventType.MixedInto)
    );
    this.tool.excel.setCellValue(
      sheet,
      this.tool.getCellName(1, 1),
      `${data.MixedInto}起`
    );
    this.tool.excel.setCellValue(
      sheet,
      this.tool.getCellName(1, 2),
      `${(data.MixedInto / count) * 100}%`
    );

    this.tool.excel.setCellValue(
      sheet,
      this.tool.getCellName(2, 0),
      Language.EventType(EventType.GarbageFull)
    );
    this.tool.excel.setCellValue(
      sheet,
      this.tool.getCellName(2, 1),
      `${data.GarbageFull}起`
    );
    this.tool.excel.setCellValue(
      sheet,
      this.tool.getCellName(2, 2),
      `${(data.GarbageFull / count) * 100}%`
    );

    this.tool.excel.setCellValue(
      sheet,
      this.tool.getCellName(3, 0),
      Language.EventType(EventType.IllegalDrop)
    );
    this.tool.excel.setCellValue(
      sheet,
      this.tool.getCellName(3, 1),
      `${data.IllegalDrop}起`
    );
    this.tool.excel.setCellValue(
      sheet,
      this.tool.getCellName(3, 2),
      `${(data.IllegalDrop / count) * 100}%`
    );
    this.completed = true;
  }
}
