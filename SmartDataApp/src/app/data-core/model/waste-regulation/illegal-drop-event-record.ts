import { EventRecord } from "./event-record";
import { EventDataObject } from "./event-data-object";
import { Transform } from "class-transformer";
import { transformDateTime } from "../transformer";
/**乱扔垃圾事件记录 */
export class IllegalDropEventRecord extends EventRecord {
  /**事件数据 */
  Data: IllegalDropEventData;
}

/**乱扔垃圾事件数据 */
export class IllegalDropEventData {
  /**垃圾房ID */
  StationId: string;
  /**垃圾房名称 */
  StationName: string;
  /**区划ID(可选) */
  DivisionId: string;
  /**区划名称(可选) */
  DivisionName: string;
  /**垃圾的目标(可选) */
  Objects: EventDataObject[];
}

/**获取事件记录参数 */
export class GetEventRecordsParams {
  /**页码[1-n](可选) */
  PageIndex?: number;
  /**分页大小[1-100](可选) */
  PageSize?: number;
  /**开始时间 */
  @Transform(transformDateTime)
  BeginTime!: Date;
  /**结束时间 */
  @Transform(transformDateTime)
  EndTime!: Date;
  /**所属区划ID列表(可选) */
  DivisionIds: string[];
  /**垃圾房ID列表(可选) */
  StationIds: string[];
  /**资源ID列表(可选) */
  ResourceIds: string[];
  /**区划名称(可选)，支持LIKE */
  DivisionName: string;
  /**垃圾房名称(可选)，支持LIKE */
  StationName: string;
  /**资源名称(可选)，支持LIKE */
  ResourceName: string;
  /**	Boolean	是否倒序时间排列	O */
  Desc?: boolean;
  /**	String[]	所属网格ID列表	O */
  GridCellIds?: string[];
  /**	String	网格名称，支持LIKE	O */
  GridCellName?: string[];
  /**	String[]	所属小区ID列表	O */
  CommunityIds?: string[];
  /**	String	小区名称，支持LIKE	O */
  CommunityName?: string;
}
