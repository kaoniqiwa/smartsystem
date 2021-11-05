import { Language } from "src/app/common/tool/language";
import { EventType } from "src/app/data-core/model/enum";
import { DivisionNumberStatistic } from "src/app/data-core/model/waste-regulation/division-number-statistic";
import { ICommitteesConverter } from "../../../interface/committees-converter.interface";
import { StatisticSummaryEventRatioChartViewModel } from "./statistic-summary-event-ratio-chart.model";

export class StatisticSummaryEventRatioChartConverter
  implements
    ICommitteesConverter<
      DivisionNumberStatistic,
      StatisticSummaryEventRatioChartViewModel
    >
{
  Convert(
    input: DivisionNumberStatistic
  ): StatisticSummaryEventRatioChartViewModel {
    let vm = new StatisticSummaryEventRatioChartViewModel();
    if (input.TodayEventNumbers) {
      for (let i = 0; i < input.TodayEventNumbers.length; i++) {
        const number = input.TodayEventNumbers[i];
        switch (number.EventType) {
          case EventType.IllegalDrop:
            vm.IllegalDrop = number.DayNumber;
            break;
          case EventType.MixedInto:
            vm.MixedInto = number.DayNumber;
            break;
          case EventType.GarbageFull:
            vm.GarbageFull = number.DayNumber;
            break;
          default:
            break;
        }
      }
    }

    return vm;
  }
}
