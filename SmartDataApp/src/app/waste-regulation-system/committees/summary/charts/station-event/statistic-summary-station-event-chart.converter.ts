import { Language } from "src/app/common/tool/language";
import { EventType } from "src/app/data-core/model/enum";
import { GarbageStationNumberStatistic } from "src/app/data-core/model/waste-regulation/garbage-station-number-statistic";
import { ICommitteesConverter } from "../../../interface/committees-converter.interface";
import { StatisticSummaryStationEventChartViewModel } from "./statistic-summary-station-event-chart.model";

export class StatisticSummaryStationEventChartConverter
  implements
    ICommitteesConverter<
      GarbageStationNumberStatistic[],
      StatisticSummaryStationEventChartViewModel[]
    >
{
  Convert(
    input: GarbageStationNumberStatistic[]
  ): StatisticSummaryStationEventChartViewModel[] {
    let array = new Array<StatisticSummaryStationEventChartViewModel>();
    for (let i = 0; i < input.length; i++) {
      const statistic = input[i];
      let item = new StatisticSummaryStationEventChartViewModel();
      item.product = statistic.Name;
      if (statistic.TodayEventNumbers) {
        for (let j = 0; j < statistic.TodayEventNumbers.length; j++) {
          const number = statistic.TodayEventNumbers[j];
          switch (number.EventType) {
            case EventType.IllegalDrop:
              item.IllegalDrop = number.DayNumber;
              item[Language.EventType(EventType.IllegalDrop)] =
                number.DayNumber;
              break;
            case EventType.MixedInto:
              item.MixedInto = number.DayNumber;
              item[Language.EventType(EventType.MixedInto)] = number.DayNumber;
              break;
            default:
              break;
          }
        }
      }
      array.push(item);
    }
    return array;
  }
}
