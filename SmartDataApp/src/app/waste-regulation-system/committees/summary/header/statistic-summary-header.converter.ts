import { EventType } from "src/app/data-core/model/enum";
import { Division } from "src/app/data-core/model/waste-regulation/division";
import {
  DivisionNumberStatistic,
  DivisionNumberStatisticV2,
} from "src/app/data-core/model/waste-regulation/division-number-statistic";
import { ICommitteesConverter } from "../../interface/committees-converter.interface";
import { StatisticSummaryViewModel } from "../statistic-summary.model";
import { StatisticSummaryHeaderViewModel } from "./statistic-summary-header.model";

export class StatisticSummaryHeaderConverter
  implements
    ICommitteesConverter<
      StatisticSummaryViewModel,
      StatisticSummaryHeaderViewModel
    >
{
  Convert(input: StatisticSummaryViewModel): StatisticSummaryHeaderViewModel {
    let vm = new StatisticSummaryHeaderViewModel();

    if (input.EventNumbers) {
      for (let i = 0; i < input.EventNumbers.length; i++) {
        const event = input.EventNumbers[i];
        switch (event.EventType) {
          case EventType.IllegalDrop:
            vm.IllegalDrop = event.DayNumber;
            break;
          case EventType.MixedInto:
            vm.MixedInto = event.DayNumber;
            break;
          case EventType.GarbageDrop:
            vm.GarbageTotal = event.DayNumber;
            break;
          case EventType.GarbageDropHandle:
            vm.GarbageHandle = event.DayNumber;
            break;
          default:
            break;
        }
      }

      vm.GarbageTimeHour = Math.floor(input.MaxGarbageTime / 60);
      vm.GarbageTimeMinute = Math.ceil(input.MaxGarbageTime % 60);
      // vm.Garde = input.

      return vm;
    }
  }
}
