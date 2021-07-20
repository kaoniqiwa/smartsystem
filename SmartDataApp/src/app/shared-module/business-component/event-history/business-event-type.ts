import { EventNumber } from "../../../data-core/model/waste-regulation/event-number";
import { EventType } from "../../../data-core/model/enum";
export enum BusinessEventTypeEnum {
  IllegalDrop = "IllegalDropEvent",
  MixedInfo = "MixedInfoEvent",
}
export function convertEventData(
  eventType: BusinessEventTypeEnum,
  en: EventNumber[],
  deltaNumber?: boolean
) {
  const data = new Array<number>();
  en.map((d) => {
    if (
      d.EventType == EventType.IllegalDrop &&
      eventType == BusinessEventTypeEnum.IllegalDrop
    )
      if (deltaNumber) data.push(d.DeltaNumber);
      else data.push(d.DayNumber);
    else if (
      d.EventType == EventType.MixedInto &&
      eventType == BusinessEventTypeEnum.MixedInfo
    )
      if (deltaNumber) data.push(d.DeltaNumber);
      else data.push(d.DayNumber);
  });
  return data;
}
