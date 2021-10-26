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
}

// export class GetGarbageDropEventRecordsParams {
export class GetGarbageDropEventRecordsParams {
  PageIndex: number; //页码[1-n]
  PageSize: number; //分页大小[1-100]
  BeginTime: Date | string; //开始时间
  EndTime: Date | string; //结束时间
  DivisionIds: string[]; //所属区划ID列表
  StationIds: string[]; //垃圾房ID列表
  ResourceIds: string[]; //	资源ID列表
  DivisionName: string; //	区划名称，支持LIKE
  StationName: string; //	垃圾房名称，支持LIKE
  ResourceName: string; //	资源名称，支持LIKE
  Desc: boolean; //	是否倒序时间排列
  GridCellIds: string[]; //	所属网格ID列表
  GridCellName: string; //	网格名称，支持LIKE
  IsHandle: boolean; //	是否已处置
  IsTimeout: boolean; //是否已超时
}
