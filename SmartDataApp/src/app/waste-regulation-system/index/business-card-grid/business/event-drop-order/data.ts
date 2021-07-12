import { EventType } from "src/app/data-core/model/waste-regulation/event-number";
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
