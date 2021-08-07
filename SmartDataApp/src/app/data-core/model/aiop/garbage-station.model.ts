import { GarbageStationCamera } from "./garbage-station-camera.model";
import { GisPoint } from "./gis-point.model";
import { Member } from "./member.model";
import { TrashCan } from "./trash-can.model";

interface TimeRange {
  BeginTime: Date | string;
  EndTime: Date | string;
}

interface GarbageParameters {
  /**处置超时时长，单位：分钟，默认：15分钟 */
  HandleTimeout?: number;
}

//投放点信息
interface GarbageStation {
  /**垃圾房ID */
  Id: string;

  /**垃圾房名称 */
  Name: string;

  /**垃圾房类型 */
  StationType: number;

  /**描述信息 */
  Description?: string;

  /**创建时间 */
  CreateTime: Date | string;

  /**更新事件 */
  UpdateTime: Date | string;

  /**GIS点位 */
  GisPoint?: GisPoint;

  /**所属区划ID */
  DivisionId?: string;

  /**垃圾桶列表 */
  TrashCans?: TrashCan[];

  /**摄像机列表 */
  Cameras?: GarbageStationCamera[];

  /**干垃圾满溢 */
  DryFull?: boolean;

  /**干垃圾满溢时间 */
  DryFullTime?: Date | string;

  /**干垃圾容积(可选)，单位：L */
  DryVolume?: number;

  /**最大干垃圾容积，单位：L */
  MaxDryVolume: number;

  /**湿垃圾满溢 */
  WetFull?: boolean;

  /**湿垃圾满溢时间 */
  WetFullTime?: Date | string;

  /**湿垃圾容积，单位：L */
  WetVolume?: number;

  /**最大湿垃圾容积，单位：L */
  MaxWetVolume: number;

  /**垃圾房状态 */
  StationState: number;

  /**评级 */
  Grade?: number;

  /**计数时间段 */
  CountSchedule?: TimeRange[];

  /**地址 */
  Address?: string;

  /**垃圾投放点类型 */
  DumpPointType?: number;

  /**停用的事件号列表 */
  DisableEventTypes?: number[];

  /**所属网格单元ID */
  GridCellId?: string;

  /**垃圾相关参数 */
  GarbageParameters?: GarbageParameters;

  /**人员 */
  Members?: Member[];
}

// export class RecordFileUrl {
//   Result: boolean;
//   Url: string;
// }

// /**获取垃圾房列表参数 */
// export class GetGarbageStationsParams {
//   /**页码[1-n](可选) */
//   PageIndex?: number;
//   /**分页大小[1-100](可选) */
//   PageSize?: number;
//   /**垃圾房ID(可选) */
//   Ids: string[];
//   /**垃圾房名称(可选)，支持LIKE */
//   Name: string;
//   /**垃圾房类型(可选) */
//   StationType?: number;
//   /**区划ID(可选) */
//   DivisionId: string;
//   /**干垃圾是否满溢(可选) */
//   DryFull?: boolean;
//   /**湿垃圾是否满溢(可选) */
//   WetFull?: boolean;
//   /**祖辈ID(可选)，返回该ID下的所有子孙区划及其本身的垃圾房 */
//   AncestorId: string;
// }

export { GarbageStation };
