import { EventNumber } from "../../../data-core/model/waste-regulation/event-number";
import { EventType } from "../../../data-core/model/enum";

export function convertEventData(
  eventType: EventType,
  en: EventNumber[],
  deltaNumber?: boolean
) {
  const data = new Array<number>();
  en.map((d) => {
    if (
      d.EventType == EventType.IllegalDrop &&
      eventType == EventType.IllegalDrop
    )
      if (deltaNumber) data.push(d.DeltaNumber);
      else data.push(d.DayNumber);
    else if (
      d.EventType == EventType.MixedInto &&
      eventType == EventType.MixedInto
    )
      if (deltaNumber) data.push(d.DeltaNumber);
      else data.push(d.DayNumber);
  });
  return data;
}
