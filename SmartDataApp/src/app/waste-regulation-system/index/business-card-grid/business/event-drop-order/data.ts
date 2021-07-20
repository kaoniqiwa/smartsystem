import { EventType } from "../../../../../data-core/model/enum";
import { IBusinessData } from "../../../../../common/interface/IBusiness";

export class EventDropOrderInfo implements IBusinessData {
  items: EventDropInfo[];
  dropList: Array<{ id: string; name: string }>;
  defaultId: string;
  eventType: EventType;
}

export class EventDropInfo {
  id: string;
  division: string;
  dropNum: number;
  unit: string;
}
