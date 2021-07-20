import { EventType } from "../enum";

/**事件数量 */
export class EventNumber {
  /**事件类型 */
  EventType: EventType;
  /**当日事件数量 */
  DayNumber: number;
  /**当日时间段内事件数量(可选) */
  DeltaNumber?: number;
}
