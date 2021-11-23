import { Transform } from "class-transformer";
import { transformDate } from "../transformer";
import { EventRecord, CameraImageUrl } from "./event-record";
import "reflect-metadata";
export class GarbageDropEventRecord extends EventRecord {
  /**事件数据 */
  Data!: GarbageDropEventData;
}

// export class GarbageFullEventData {
export class GarbageDropEventData {
  StationId!: string; //	垃圾房ID
  StationName!: string; //	垃圾房名称
  DivisionId?: string; //区划ID
  DivisionName?: string; //区划名称
  GridCellId?: string; //	网格单元ID
  GridCellName?: string; //	网格单元名称
  @Transform(transformDate)
  DropTime!: Date; //落地时间
  @Transform(transformDate)
  HandleTime?: Date; //处置时间
  IsHandle!: boolean; //小包垃圾落地是否已处置
  IsTimeout!: boolean; //是否超时
  DropImageUrls?: CameraImageUrl[]; //	垃圾落地的图片ID、图片地址列表
  HandleImageUrls?: CameraImageUrl[]; //	垃圾处置的图片ID、图片地址列表
  TimeoutImageUrls?: CameraImageUrl[]; //超时未处置的图片ID、图片地址列表
  /**	Boolean	处置人员是否已处置	O */
  Processed?: boolean;
  /**	String	处置人员名称	O */
  ProcessorName?: string;
  /**	String	处置人员ID	O */
  ProcessorId?: string;
  /**	String	手机号码	O */
  ProcessorMobileNo?: string;
  /**	DateTime	处置时间	O */
  @Transform(transformDate)
  ProcessTime?: Date;
  /**	String	处置描述	O */
  ProcessDescription?: string;
  /**	String	小区ID	O */
  CommunityId?: string;
  /**	String	小区名称	O */
  CommunityName?: string;
  /**	String	工单号	O */
  RecordNo?: string;
}

// export class GetGarbageDropEventRecordsParams {
export class GetGarbageDropEventRecordsParams {
  /**	Int32	页码[1-n]	O */
  PageIndex?: number;
  /**	Int32	分页大小[1-100]	O */
  PageSize?: number;
  /**	DateTime	开始时间	M */
  @Transform(transformDate)
  BeginTime!: Date;
  /**	DateTime	结束时间	M */
  @Transform(transformDate)
  EndTime!: Date;
  /**	String[]	所属区划ID列表	O */
  DivisionIds?: string[];
  /**	String[]	垃圾房ID列表	O */
  StationIds?: string[];
  /**	String[]	资源ID列表	O */
  ResourceIds?: string[];
  /**	String	区划名称，支持LIKE	O */
  DivisionName?: string;
  /**	String	垃圾房名称，支持LIKE	O */
  StationName?: string;
  /**	String	资源名称，支持LIKE	O */
  ResourceName?: string;
  /**	Boolean	是否倒序时间排列	O */
  Desc?: boolean;
  /**	String[]	所属网格ID列表	O */
  GridCellIds?: string[];
  /**	String	网格名称，支持LIKE	O */
  GridCellName?: string;
  /**	Boolean	是否已处置	O */
  IsHandle?: boolean;
  /**	Boolean	是否已滞留	O */
  IsTimeout?: boolean;
  /**	String[]	所属小区ID列表	O */
  CommunityIds?: string[];
  /**	String	小区名称，支持LIKE	O */
  CommunityName?: string;
  /**	String	工单号，支持LIKE	O */
  RecordNo?: string;
}
