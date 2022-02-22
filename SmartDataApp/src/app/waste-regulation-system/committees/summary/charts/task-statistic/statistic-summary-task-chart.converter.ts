import { EventType } from "src/app/data-core/model/enum";
import { ICommitteesConverter } from "../../../interface/committees-converter.interface";
import { StatisticSummaryViewModel } from "../../statistic-summary.model";
import { StatisticSummaryTaskChartViewModel } from "./statistic-summary-task-chart.model";

export class StatisticSummaryTaskChartConverter
  implements
    ICommitteesConverter<
      StatisticSummaryViewModel[],
      StatisticSummaryTaskChartViewModel
    >
{
  Convert(
    input: StatisticSummaryViewModel[]
  ): StatisticSummaryTaskChartViewModel {
    let vm = new StatisticSummaryTaskChartViewModel();
    for (let i = 0; i < input.length; i++) {
      const statistic = input[i];

      let complate = 0;
      let handle = 0;
      if (statistic.EventNumbers) {
        for (let i = 0; i < statistic.EventNumbers.length; i++) {
          const number = statistic.EventNumbers[i];
          switch (number.EventType) {
            case EventType.GarbageDrop:
              vm.TotalCount += number.DayNumber;
              break;
            case EventType.GarbageDropTimeout:
              vm.GarbageTimeoutCount += number.DayNumber;
              break;
            case EventType.GarbageDropHandle:
              handle += number.DayNumber;
              break;

            default:
              break;
          }
        }
      }
      vm.UncompletedCount = vm.TotalCount - handle;
      vm.taskRatio = 100;
      if (vm.TotalCount > 0) {
        vm.taskRatio = Math.ceil((handle / vm.TotalCount) * 100);
      }

      vm.timeoutRatio =
        vm.TotalCount == 0
          ? 0
          : Math.ceil((vm.GarbageTimeoutCount / vm.TotalCount) * 100);

      return vm;
    }
  }
}
