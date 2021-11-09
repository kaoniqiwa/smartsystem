import { Language } from "src/app/common/tool/language";
import { EventType } from "src/app/data-core/model/enum";
import {
  GarbageStationNumberStatistic,
  GarbageStationNumberStatisticV2,
} from "src/app/data-core/model/waste-regulation/garbage-station-number-statistic";
import { ICommitteesConverter } from "../../../interface/committees-converter.interface";
import { StatisticSummaryStationEventChartViewModel } from "./statistic-summary-station-event-chart.model";

export class StatisticSummaryStationEventChartConverter
  implements
    ICommitteesConverter<
      GarbageStationNumberStatisticV2[],
      StatisticSummaryStationEventChartViewModel[]
    >
{
  Convert(
    input: GarbageStationNumberStatisticV2[]
  ): StatisticSummaryStationEventChartViewModel[] {
    let array = new Array<StatisticSummaryStationEventChartViewModel>();
    let ids = new Array<string>();
    for (let i = 0; i < input.length; i++) {
      const statistic = input[i];
      let item: StatisticSummaryStationEventChartViewModel;
      if (ids.includes(statistic.Id)) {
        item = array.find((x) => x.id === statistic.Id)!;
        let index = array.indexOf(item);
        item = this.add(statistic, item);
        // array[index] = item
      } else {
        ids.push(statistic.Id);

        item = this.create(statistic);

        array.push(item);
      }
    }
    return array;
  }

  add(
    statistic: GarbageStationNumberStatisticV2,
    item: StatisticSummaryStationEventChartViewModel
  ) {
    if (statistic.EventNumbers) {
      for (let j = 0; j < statistic.EventNumbers.length; j++) {
        const number = statistic.EventNumbers[j];
        switch (number.EventType) {
          case EventType.IllegalDrop:
            item.IllegalDrop = number.DayNumber;
            (item[Language.EventType(EventType.IllegalDrop)] as number) +=
              number.DayNumber;
            break;
          case EventType.MixedInto:
            item.MixedInto = number.DayNumber;
            (item[Language.EventType(EventType.MixedInto)] as number) +=
              number.DayNumber;
            break;
          default:
            break;
        }
      }
    }
    return item;
  }

  create(statistic: GarbageStationNumberStatisticV2) {
    let item = new StatisticSummaryStationEventChartViewModel();
    item.id = statistic.Id;
    item.product = statistic.Name;
    if (statistic.EventNumbers) {
      for (let j = 0; j < statistic.EventNumbers.length; j++) {
        const number = statistic.EventNumbers[j];
        switch (number.EventType) {
          case EventType.IllegalDrop:
            item.IllegalDrop = number.DayNumber;
            item[Language.EventType(EventType.IllegalDrop)] = number.DayNumber;
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
    return item;
  }
}
