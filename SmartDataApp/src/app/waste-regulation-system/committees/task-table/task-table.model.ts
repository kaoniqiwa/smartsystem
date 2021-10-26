import { EventType } from "src/app/data-core/model/enum";

export class TaskTableViewModel {
  /** 索引 */
  Id: number;
  /** 厢房名称 */
  StationName: string;
  /** 处置人 */
  Processor: string;
  /** 落地时长 */
  Interval: string;
  /** 垃圾落地时间 */
  Time: string;
  /** 状态 */
  State: EventType;
  StateLanguage: string;
}
