/**事件数量 */
export class EventNumber {
  /**事件类型 */
  EventType: EventType;
  /**当日事件数量 */
  DayNumber: number;
  /**当日时间段内事件数量(可选) */
  DeltaNumber?: number;
}

/**
 *  事件类型
 *
 * @export
 * @enum {number}
 */
export enum EventType {
  /**
   * 	乱扔垃圾事件	1
   */
  IllegalDrop = 1,
  /**
   *	混合投放事件	2
   */
  MixedInto = 2,
  /**
   *	垃圾容量事件	3
   */
  GarbageVolume = 3,
  /**
   *	垃圾满溢事件	4
   */
  GarbageFull = 4,
  /**
   *	小包垃圾落地	5
   */
  GarbageDrop = 5,
  /**
   *	小包垃圾滞留	6
   */
  GarbageDropTimeout = 6,
  /**
   *	小包垃圾处置完成	7
   */
  GarbageDropHandle = 7,
}
