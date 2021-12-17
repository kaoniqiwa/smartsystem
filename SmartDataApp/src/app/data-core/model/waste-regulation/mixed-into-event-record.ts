import { EventRecord } from "./event-record";
import { EventDataObject } from "./event-data-object";
import { EventRule } from "./event-rule";
import { Type } from "class-transformer";
/**混合投放事件记录 */
export class MixedIntoEventRecord extends EventRecord {
  /**事件数据 */
  @Type(() => MixedIntoEventData)
  Data: MixedIntoEventData;
}
/**/ //  */
export class MixedIntoEventData {
  /**垃圾房ID */
  StationId!: string;
  /**垃圾房名称 */
  StationName!: string;
  /**区划ID(可选) */
  DivisionId?: string;
  /**区划名称(可选) */
  DivisionName?: string;
  /**垃圾的目标(可选) */
  @Type(() => EventDataObject)
  Objects?: EventDataObject[];
  /**图片ID、图片地址列表(可选) */
  PersonImageUrls?: string[];

  /**	String	网格单元ID	O */
  GridCellId?: string;
  /**	String	网格单元名称	O */
  GridCellName?: string;
  /**	String	小区ID	O */
  CommunityId?: string;
  /**	String	小区名称	O */
  CommunityName?: string;
  /**	EventRule[]	事件规则	O */
  @Type(() => EventRule)
  Rules?: EventRule[];
}
