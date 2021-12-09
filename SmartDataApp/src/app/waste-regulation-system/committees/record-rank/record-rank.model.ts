import { Language } from "src/app/common/tool/language";
import { EventType } from "src/app/data-core/model/enum";

export class RecordRankItemViewModel {
  Index: number;
  Id: string;
  Name: string;
  value: number;
  value_html: string;
  unit: string;
}

export class RecordRankViewModel {
  public get Title(): string {
    switch (this.EventType) {
      case EventType.IllegalDrop:
        return Language.json.EventType.IllegalDrop + Language.json.rank;

      case EventType.MixedInto:
        return Language.json.EventType.MixedInto + Language.json.rank;
      case EventType.GarbageVolume:
        return (
          Language.json.garbage + Language.json.volume + Language.json.rank
        );
      case EventType.GarbageFull:
        return Language.json.garbage + Language.json.full + Language.json.rank;
      case EventType.GarbageDrop:
        return (
          Language.json.garbage +
          Language.json.stay +
          Language.json.station +
          Language.json.number +
          Language.json.rank
        );
      case EventType.GarbageDropTimeout:
        return (
          Language.json.small +
          Language.json.garbage +
          Language.json.timeout +
          Language.json.wait +
          Language.json.handle +
          Language.json.rank
        );

      case EventType.GarbageDropHandle:
        return (
          Language.json.small +
          Language.json.garbage +
          Language.json.did +
          Language.json.handle +
          Language.json.rank
        );
      case "Timer":
        return (
          Language.json.garbage +
          Language.json.stay +
          Language.json.timer +
          Language.json.rank
        );
      default:
        return "";
    }
  }

  EventType: number | string;

  EventTypeName: string;

  items: RecordRankItemViewModel[];
}

export interface IRecordRankDataType {}

export interface RecordRankDataType extends IRecordRankDataType {
  IllegalDrop: EventType.IllegalDrop;
  MixedInto: EventType.MixedInto;
}
export interface RecordRankGarbageDropDataType {
  GarbageDrop: EventType.GarbageDrop;
  Timer: "timer";
}
