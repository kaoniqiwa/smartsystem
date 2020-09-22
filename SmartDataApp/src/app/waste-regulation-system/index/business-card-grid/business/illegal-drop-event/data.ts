import { IBusinessData } from "../../../../../common/interface/IBusiness";
export class IllegalDropEventInfos implements IBusinessData{
    items:IllegalDropEventInfo[];
}

export class IllegalDropEventInfo implements IBusinessData{
   /**事件类型 */
    EventType: number;
    /**事件时间 */
    EventTime: string;
    /**垃圾房名称 */
    StationName: string;
    /**区划名称(可选) */
    DivisionName: string;
    /**图片ID、图片地址(可选) */
    ImageUrl: string;
    /**录像文件ID、录像地址(可选) */
    RecordUrl: string;

    ResourceId:string;

    StationId:string;
}