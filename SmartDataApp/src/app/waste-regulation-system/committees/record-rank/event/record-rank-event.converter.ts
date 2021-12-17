import { Language } from "src/app/common/tool/language";
import { EventType } from "src/app/data-core/model/enum";
import { GarbageStationNumberStatistic } from "src/app/data-core/model/waste-regulation/garbage-station-number-statistic";
import { ICommitteesConverter } from "../../interface/committees-converter.interface";
import { RecordRankItemViewModel } from "../record-rank.model";

export class RecordRankEventConverter
  implements
    ICommitteesConverter<
      GarbageStationNumberStatistic,
      RecordRankItemViewModel
    >
{
  Convert(statistic: GarbageStationNumberStatistic, type: EventType) {
    let vm = new RecordRankItemViewModel();

    vm.Id = statistic.Id;
    vm.Name = statistic.Name;
    vm.unit = this.getUnit(type);
    vm.value = statistic.TodayEventNumbers.find(
      (x) => x.EventType === type
    ).DayNumber;
    vm.value_html = vm.value.toString();
    return vm;
  }
  getUnit(type: EventType) {
    switch (type) {
      case EventType.IllegalDrop:
      case EventType.MixedInto:
        return Language.json.Suffix.event;
      case EventType.GarbageDrop:
        return "个";
      default:
        return "";
    }
  }
}
export class RecordRankEventTypes implements IBussinessEnum {
  [key: string]: BussinessEnumItem;
  IllegalDrop: BussinessEnumItem = {
    key: EventType.IllegalDrop,
    value: Language.EventType(EventType.IllegalDrop),
  };
  MixedInto: BussinessEnumItem = {
    key: EventType.MixedInto,
    value: Language.EventType(EventType.MixedInto),
  };
}
