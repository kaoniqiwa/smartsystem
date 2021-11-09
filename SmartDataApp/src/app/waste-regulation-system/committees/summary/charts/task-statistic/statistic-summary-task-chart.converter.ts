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
      if (statistic.EventNumbers) {
        for (let i = 0; i < statistic.EventNumbers.length; i++) {
          const number = statistic.EventNumbers[i];
          switch (number.EventType) {
            case EventType.GarbageDrop:
              vm.TotalCount += number.DayNumber;
              break;
            case EventType.GarbageDropTimeout:
              vm.UncompletedCount += number.DayNumber;
              break;
            case EventType.GarbageDropHandle:
              vm.GarbageRetentionCount += number.DayNumber;
              break;

            default:
              break;
          }
        }
      }
      vm.ratio = 100;
      if (vm.TotalCount > 0) {
        vm.ratio = Math.ceil((vm.GarbageRetentionCount / vm.TotalCount) * 100);
      }
      
      return vm;
    }
  }
}
