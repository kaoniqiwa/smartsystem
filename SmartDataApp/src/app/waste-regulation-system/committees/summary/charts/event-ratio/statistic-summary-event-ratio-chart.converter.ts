import { EventType } from "src/app/data-core/model/enum";
import { ICommitteesConverter } from "../../../interface/committees-converter.interface";
import { StatisticSummaryViewModel } from "../../statistic-summary.model";
import { StatisticSummaryEventRatioChartViewModel } from "./statistic-summary-event-ratio-chart.model";

export class StatisticSummaryEventRatioChartConverter
  implements
    ICommitteesConverter<
      StatisticSummaryViewModel[],
      StatisticSummaryEventRatioChartViewModel
    >
{
  Convert(
    input: StatisticSummaryViewModel[]
  ): StatisticSummaryEventRatioChartViewModel {
    let vm = new StatisticSummaryEventRatioChartViewModel();
    for (let i = 0; i < input.length; i++) {
      const statistic = input[i];
      if (statistic.EventNumbers) {
        for (let i = 0; i < statistic.EventNumbers.length; i++) {
          const number = statistic.EventNumbers[i];
          switch (number.EventType) {
            case EventType.IllegalDrop:
              vm.IllegalDrop += number.DayNumber;
              break;
            case EventType.MixedInto:
              vm.MixedInto += number.DayNumber;
              break;
            case EventType.GarbageFull:
              vm.GarbageFull += number.DayNumber;
              break;
            default:
              break;
          }
        }
      }
    }

    return vm;
  }
}
