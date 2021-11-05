import { EventType } from "src/app/data-core/model/enum";
import { ICommitteesConverter } from "../../../interface/committees-converter.interface";
import { StatisticSummaryViewModel } from "../../statistic-summary.model";
import { StatisticSummaryTaskChartViewModel } from "./statistic-summary-task-chart.model";

export class StatisticSummaryTaskChartConverter
  implements
    ICommitteesConverter<
      StatisticSummaryViewModel,
      StatisticSummaryTaskChartViewModel
    >
{
  Convert(
    input: StatisticSummaryViewModel,
    ...args: any[]
  ): StatisticSummaryTaskChartViewModel {
    let vm = new StatisticSummaryTaskChartViewModel();
    vm.Id = input.Id;
    vm.Name = input.Name;

    let complate = 0;

    if (input.EventNumbers) {
      for (let i = 0; i < input.EventNumbers.length; i++) {
        const number = input.EventNumbers[i];
        switch (number.EventType) {
          case EventType.GarbageDrop:
            vm.TotalCount = number.DayNumber;
            break;
          case EventType.GarbageDropTimeout:
            vm.UncompletedCount = number.DayNumber;
            break;
          case EventType.GarbageDropHandle:
            vm.GarbageRetentionCount = number.DayNumber;
            break;

          default:
            break;
        }
      }
    }
    vm.ratio = 100;
    if (vm.TotalCount > 0) {
      vm.ratio = (vm.GarbageRetentionCount / vm.TotalCount) * 100;
    }
    return vm;
  }
}
