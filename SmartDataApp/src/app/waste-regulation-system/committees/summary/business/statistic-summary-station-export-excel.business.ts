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
  data: StatisticSummaryStationEventChartViewModel[];
  completed: boolean = false;
  tool: ExportTool;
  export(title: string, row: number): number {
    try {
      row = this.tool.setTitle(title, row);

      let headers = [
        "序号",
        "厢房名称",
        Language.EventType(EventType.IllegalDrop),
        Language.EventType(EventType.MixedInto),
      ];
      row = this.tool.setRow(headers, row);

      for (let i = 0; i < this.data.length; i++) {
        const item = this.data[i];
        let name = this.tool.getCellName(0, row);
        this.tool.setCellValue(name, i + 1);
        this.tool.setCellValue(this.tool.getCellName(1, row), item.product);
        this.tool.setCellValue(
          this.tool.getCellName(2, row),
          item[Language.EventType(EventType.IllegalDrop)]
        );
        this.tool.setCellValue(
          this.tool.getCellName(3, row),
          item[Language.EventType(EventType.MixedInto)]
        );
        row++;
      }
      return row;
    } catch (ex) {
      console.error(ex);
    } finally {
      this.completed = true;
    }
  }
}
