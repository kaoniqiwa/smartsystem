import { EventNumber } from "./event-number";
/**区划数量统计 */
export interface DivisionNumberStatistic {
    /**区划ID */
    Id: string;
    /**区划名称 */
    Name: string;
    /**垃圾房数量 */
    StationNumber: number;
    /**摄像机数量 */
    CameraNumber: number;
    /**离线摄像机数量 */
    OfflineCameraNumber: number;
    /**垃圾桶数量 */
    TrashCanNumber: number;
    /**下一层区划数量 */
    ChildDivisionNumber: number;
    /**叶区划数量 */
    LeafDivisionNumber: number;
    /**干垃圾满溢垃圾房数量 */
    DryFullStationNumber: number;
    /**湿垃圾满溢垃圾房数量 */
    WetFullStationNumber: number;
    /**当日事件数量(可选) */
    TodayEventNumbers: EventNumber[];
    /**当天总数量，单位：L */
    DayVolume: number;
    /**当天干垃圾容量，单位：L */
    DayDryVolume: number;
    /**当天湿垃圾容量，单位：L */
    DayWetVolume: number;
}

/// <summary>
/**获取区划数量参数
 */
export class GetDivisionStatisticNumbersParams {
    /**页码[1-n](可选) */
    PageIndex: number | null;
    /**分页大小[1-100](可选) */
    PageSize: number | null;
    /**区划ID(可选) */
    Ids: string[];
    /**区划名称(可选)，支持LIKE */
    Name: string;
}

export class GetDivisionStatisticNumbersParamsV2 {
    BeginTime: Date | string;	//开始时间
    EndTime: Date | string;	//结束时间
    TimeUnit: number;	//统计时间单位：
    //2-Day,3-Week,4-Month
    DivisionIds: string[];	//区划ID列表
    Asc: string[];	//升序排列的属性名称
    Desc: string[];	//降序排列的属性名称
}

export class DivisionNumberStatisticV2 {
    Id: string;	//区划ID
    Name: string;//区划名称
    Time: StatisticTime;	//统计时间对象
    EventNumbers: EventNumber[];	//当日事件数量
    Volume: number;	//总数量，单位：L
    DryVolume: number;	//干垃圾容量，单位：L
    WetVolume: number;	//湿垃圾容量，单位：L
}

export interface StatisticTime {
    Year: number;	//年
    Month: number;	//月
    Day: number;//	日
    Week: number;	//第几周
}