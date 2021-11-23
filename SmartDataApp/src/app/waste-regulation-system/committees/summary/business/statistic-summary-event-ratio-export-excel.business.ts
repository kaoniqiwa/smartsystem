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
  data: StatisticSummaryEventRatioChartViewModel;
  completed: boolean = false;
  tool: ExportTool;
  export(title: string, row: number): number {
    try {
      let count =
        this.data.MixedInto + this.data.GarbageFull + this.data.IllegalDrop;

      row = this.tool.setTitle(title, row);

      let headers = [
        "类型",
        Language.EventType(EventType.MixedInto),
        Language.EventType(EventType.GarbageFull),
        Language.EventType(EventType.IllegalDrop),
      ];
      row = this.tool.setRow(headers, row);

      let numbers = [
        "数量",
        `${this.data.MixedInto}起`,
        `${this.data.GarbageFull}起`,
        `${this.data.IllegalDrop}起`,
      ];
      row = this.tool.setRow(numbers, row);

      let ratios = [
        "占比",
        `${(this.data.MixedInto / count) * 100}%`,
        `${(this.data.GarbageFull / count) * 100}%`,
        `${(this.data.IllegalDrop / count) * 100}%`,
      ];
      return this.tool.setRow(ratios, row);
    } catch (ex) {
      console.error(ex);
    } finally {
      this.completed = true;
    }
  }
}
