import { Language } from "src/app/common/tool/language";
import { EventType } from "src/app/data-core/model/enum";
import { GarbageStationNumberStatistic } from "src/app/data-core/model/waste-regulation/garbage-station-number-statistic";
import { ICommitteesConverter } from "../../interface/committees-converter.interface";
import { RecordRankItemViewModel } from "../record-rank.model";

export class RecordRankDropConverter
  implements
    ICommitteesConverter<
      GarbageStationNumberStatistic,
      RecordRankItemViewModel
    >
{
  Convert(statistic: GarbageStationNumberStatistic, type: EventType | string) {
    let vm = new RecordRankItemViewModel();
    vm.Id = statistic.Id;
    vm.Name = statistic.Name;
    if (typeof type === "string") {
      vm.value = statistic.CurrentGarbageTime;
      vm.value_html = Language.Time(statistic.CurrentGarbageTime);
      if (!vm.value_html) {
        vm.value_html = "0分钟";
      }
    } else {
      vm.unit = "个";
      vm.value = statistic.TodayEventNumbers.find(
        (x) => x.EventType === type
      ).DayNumber;
      vm.value_html = vm.value.toString();
    }

    return vm;
  }
}

export class RecordRankDropTypes implements IBussinessEnum {
  [key: string]: { key: string | number; value: string };

  Timer = {
    key: "Timer",
    value: "滞留时长",
  };
  GarbageDrop = {
    key: EventType.GarbageDrop,
    value: "滞留数量",
  };
}
