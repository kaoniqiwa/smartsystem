import { Language } from "src/app/common/tool/language";
import { EventType } from "src/app/data-core/model/enum";
import { StatisticSummaryStationEventChartViewModel } from "../charts/station-event/statistic-summary-station-event-chart.model";
import { ExportTool, IExport } from "./statistic-summary-export-excel.business";

export class StatisticSummaryStationsExportExcelBusiness
  implements IExport<StatisticSummaryStationEventChartViewModel[]>
{
  constructor(tool: ExportTool) {
    this.tool = tool;
  }
  completed: boolean = false;
  tool: ExportTool;
  export(
    title: string,
    data: StatisticSummaryStationEventChartViewModel[]
  ): void {
    let sheet = this.tool.excel.addWorksheet(this.tool.book, title);

    let startRow = 1;

    this.tool.excel.setCellValue(
      sheet,
      this.tool.getCellName(0, 0),
      "厢房名称"
    );
    this.tool.excel.setCellValue(
      sheet,
      this.tool.getCellName(1, 0),
      Language.EventType(EventType.IllegalDrop)
    );
    this.tool.excel.setCellValue(
      sheet,
      this.tool.getCellName(2, 0),
      Language.EventType(EventType.MixedInto)
    );

    for (let i = 0; i < data.length; i++) {
      const item = data[i];

      this.tool.excel.setCellValue(
        sheet,
        this.tool.getCellName(0, i + startRow),
        item.product
      );
      this.tool.excel.setCellValue(
        sheet,
        this.tool.getCellName(1, i + startRow),
        item.IllegalDrop
      );
      this.tool.excel.setCellValue(
        sheet,
        this.tool.getCellName(2, i + startRow),
        item.MixedInto
      );
    }

    this.completed = true;
  }
}
