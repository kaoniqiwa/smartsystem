import { EventType } from "src/app/data-core/model/enum";

export class StatisticSummaryLineChartViewModel {
  title: string;
  type: EventType;
  xAxis: string[] = new Array<string>();
  data: number[] = new Array<number>();
}
