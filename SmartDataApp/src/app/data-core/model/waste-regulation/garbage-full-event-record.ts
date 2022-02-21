import { EventRecord } from "./event-record";
/**混合投放事件记录 */
export class GarbageFullEventRecord extends EventRecord {
  /**事件数据 */
  Data: GarbageFullEventData;
}
/**/ //  */
export class GarbageFullEventData {
  /**垃圾房ID */
  StationId: string;
  /**垃圾房名称 */
  StationName: string;
  /**区划ID(可选) */
  DivisionId: string;
  /**区划名称(可选) */
  DivisionName: string;
  FullTime: string | Date; //	第一次满溢时间
  ImageUrls: string[]; //图片ID、图片地址列表
  CameraImageUrls: CameraImageUrl[];

  /**	String	网格单元ID	O */
  GridCellId?: string;
  /**	String	网格单元名称	O */
  GridCellName?: string;
  /**	String	小区ID	O */
  CommunityId?: string;
  /**	String	小区名称	O */
  CommunityName?: string;
}

export interface CameraImageUrl {
  CameraId: string; //摄像机ID
  CameraName: string; //摄像机名称
  ImageUrl: string; //照片地址
}
