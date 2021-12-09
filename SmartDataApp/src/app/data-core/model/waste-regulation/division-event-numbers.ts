import { Transform, Type } from "class-transformer";
import { transformDateTime } from "../transformer";
import { EventNumber } from "./event-number";
/**事件数量统计 */
export class EventNumberStatistic {
  /**事件数量 */
  @Type(() => EventNumber)
  EventNumbers: EventNumber[];
  /**开始时间 */
  @Transform(transformDateTime)
  BeginTime: Date;
  /**结束时间 */
  @Transform(transformDateTime)
  EndTime: Date;
}
/**获取区划事件数量参数 */
export class GetDivisionEventNumbersParams {
  /**页码[1-n](可选) */
  PageIndex?: number;
  /**分页大小[1-100](可选) */
  PageSize?: number;
  /**开始时间 */
  BeginTime: Date | string;
  /**结束时间 */
  EndTime: Date | string;
  /**统计时间单位:1-Hour，2-Day */
  TimeUnit: number;
}

/**获取垃圾房事件数量参数 */
export class GetGarbageStationnEventNumbersParams {
  /**页码[1-n](可选) */
  PageIndex?: number;
  /**分页大小[1-100](可选) */
  PageSize?: number;
  /**开始时间 */
  BeginTime: Date | string;
  /**结束时间 */
  EndTime: Date | string;
  /**统计时间单位:1-Hour，2-Day */
  TimeUnit: number;
}
