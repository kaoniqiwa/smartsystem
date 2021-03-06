import { EventNumber } from "./event-number";
import { StatisticTime } from "./division-number-statistic";
import { Transform, Type } from "class-transformer";
import { StationState, TimeUnit } from "../enum";
import { transformDate, transformDateTime } from "../transformer";

/**垃圾房数量统计 */
export class GarbageStationNumberStatistic {
  /**垃圾房ID */
  Id!: string;
  /**垃圾房名称 */
  Name!: string;
  /**摄像机数量 */
  CameraNumber!: number;
  /**离线摄像机数量 */
  OfflineCameraNumber!: number;
  /**垃圾桶数量 */
  TrashCanNumber!: number;
  /**干垃圾满溢垃圾桶数量 */
  DryTrashCanNumber!: number;
  /**湿垃圾满溢垃圾桶数量 */
  WetTrashCanNumber!: number;
  /**当日事件数量(可选) */
  @Type(() => EventNumber)
  TodayEventNumbers?: EventNumber[];
  /**当天总数量，单位：L  */
  DayVolume!: number;
  /**当天干垃圾容量，单位：L  */
  DayDryVolume!: number;
  /**当天湿垃圾容量，单位：L  */
  DayWetVolume!: number;

  StationState!: StationState; //垃圾房状态
  Garde?: number; //评级
  FullDuration?: number; //满溢时间，单位：分钟
  GarbageCount?: number; //当前垃圾堆数量
  CurrentGarbageTime?: number; //当前垃圾堆滞留时间
  GarbageRatio?: number; //当日垃圾滞留比值
  AvgGarbageTime?: number; //当日垃圾堆平均滞留时间，单位：分钟
  MaxGarbageTime?: number; //当日垃圾堆最大滞留时间，单位：分钟
  MaxGarbageCount?: number; //当日最大滞留堆数量
  /** ;	有垃圾时长，单位：分钟	O*/
  GarbageDuration?: number;
  /** 	无垃圾时长，单位：分钟	O*/
  CleanDuration?: number;
  /**	Int32	总处理任务数量	O */
  TotalTaskCount?: number;
  /**	Int32	完成任务数量	O */
  CompleteTaskCount?: number;
  /**	Int32	未完成任务数量	O */
  TimeoutTaskCount?: number;
}

/**获取垃圾房数量参数 */
export class GetGarbageStationStatisticNumbersParams {
  /**页码[1-n](可选) */
  PageIndex?: number;
  /**分页大小[1-100](可选) */
  PageSize?: number;
  /**区划ID(可选) */
  Ids?: string[];
  /**区划名称(可选)，支持LIKE */
  Name?: string;
  /**当前有没有垃圾落地 */
  GarbageDrop?: boolean;
  /**	String	区划ID	O */
  DivisionId?: string;
  /**	String	网格ID	O */
  GridCellId?: string;

  /**	String	小区ID	O */
  CommunityId?: string;

  CommunityName?: string;
}

export class GarbageStationNumberStatisticV2 {
  Id: string; //垃圾房ID
  Name: string; //垃圾房名称
  Time: StatisticTime; //统计时间对象
  EventNumbers: EventNumber[]; //当日事件数量
  Volume: number; //总数量，单位：L
  DryVolume: number; //	干垃圾容量，单位：L
  WetVolume: number; //	湿垃圾容量，单位：L
  Garde: number; //	评级
  FullDuration: number; //满溢时间，单位：分钟
  GarbageRatio: number; //垃圾滞留比值
  AvgGarbageTime: number; //	垃圾堆平均滞留时间，单位：分钟
  MaxGarbageTime: number; //	垃圾堆最大滞留时间，单位：分钟
  MaxGarbageCount: number; //当日最大滞留堆数量
  GarbageDuration: number; //	 	有垃圾时长，单位：分钟
  CleanDuration: number; // 	无垃圾时长，单位：分钟
}

export class GetGarbageStationStatisticNumbersParamsV2 {
  @Transform(transformDateTime)
  BeginTime: Date; //开始时间
  @Transform(transformDateTime)
  EndTime: Date; //结束时间
  GarbageStationIds: string[]; //	垃圾房ID列表
  TimeUnit: TimeUnit; //	统计时间单位：
  //2-Day,3-Week,4-Month
  Asc: string[]; //升序排列的属性名称
  Desc: string[]; //降序排列的属性名称
}

export class GetGarbageStationStatisticGarbageCountsParams {
  @Transform(transformDate)
  Date: Date;
  GarbageStationIds: string[]; //垃圾房ID列表
}

export class GarbageStationGarbageCountStatistic {
  Id: string; //	垃圾房ID
  Name: string; //	垃圾房名称
  @Transform(transformDateTime)
  BeginTime: Date; //	开始时间
  @Transform(transformDateTime)
  EndTime: Date; //结束时间
  GarbageCount: number; //	垃圾堆数量
  GarbageDuration: number; //	有垃圾时长，单位：分钟
  CleanDuration: number; //	无垃圾时长，单位：分钟
}
