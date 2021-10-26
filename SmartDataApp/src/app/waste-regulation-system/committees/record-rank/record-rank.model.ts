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
        return "乱丢垃圾排名";
      case EventType.MixedInto:
        return "混合投放排名";
      case EventType.GarbageVolume:
        return "垃圾容量排名";
      case EventType.GarbageFull:
        return "垃圾满溢排名";
      case EventType.GarbageDrop:
        return "垃圾滞留投放点数量排名";
      case EventType.GarbageDropTimeout:
        return "小包垃圾超时待处置排名";
      case EventType.GarbageDropHandle:
        return "小包垃圾已处置排名";
      case "Timer":
        return "垃圾滞留时长排名";
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
