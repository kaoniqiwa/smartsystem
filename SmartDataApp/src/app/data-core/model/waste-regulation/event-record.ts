/**事件记录接口 */
    export interface IEventRecord
    {
        /**事件ID */Id: string;
        /**事件时间 */EventTime: Date | string;
        /**事件类型 */EventType: number;
        /**事件描述信息(可选) */EventDescription: string;
        /**资源ID(可选) */ResourceId: string;
        /**
         * 资源类型(可选)：
         * Camera：监控点
         * EncodeDevice：编码设备
         * IoTSensor：物联网传感器
         */ResourceType: string;
        /**资源名称(可选) */ResourceName: string;
        /**图片ID、图片地址(可选) */ImageUrl: string;
        /**录像文件ID、录像地址(可选) */RecordUrl: string;
        /**事件关键字(可选) */EventIndexes: string[];
    }
    /**事件记录 */
    export interface EventRecord extends IEventRecord
    {
        /**事件ID */
        Id: string;
        /**事件时间 */
        EventTime: Date | string;
        /**事件类型 */
        EventType: number;
        /**事件描述信息(可选) */
        EventDescription: string;
        /**资源ID(可选) */
        ResourceId: string;
        /**
         * 资源类型(可选)：
         * Camera：监控点
         * EncodeDevice：编码设备
         * IoTSensor：物联网传感器
         */
        ResourceType: string;
        /**资源名称(可选) */
        ResourceName: string;
        /**图片ID、图片地址(可选) */
        ImageUrl: string;
        /**录像文件ID、录像地址(可选) */
        RecordUrl: string;
        /**事件关键字(可选) */
        EventIndexes: string[];

        
    }