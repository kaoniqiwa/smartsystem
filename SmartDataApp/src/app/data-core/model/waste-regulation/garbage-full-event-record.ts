import { EventRecord } from "./event-record"; 
/**混合投放事件记录 */
    export interface GarbageFullEventRecord extends EventRecord
    {
        /**事件数据 */
        Data: GarbageFullEventData;
    }
    /**///  */
    export interface GarbageFullEventData
    {
        /**垃圾房ID */
        StationId: string;
        /**垃圾房名称 */
        StationName: string;
        /**区划ID(可选) */
        DivisionId: string;
        /**区划名称(可选) */
        DivisionName: string;
        FullTime:	string|Date;//	第一次满溢时间
        ImageUrls:	string[]	//图片ID、图片地址列表

    }