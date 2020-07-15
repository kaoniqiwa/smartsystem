import { GisPointElement } from "./igis-point-element";
import { MapElement } from "./map-element";
import { PlatformAccess } from "./iplatform-access";
import { ResourceLabel } from "./single-result";


/**
 * 资源信息规范接口
 */
export interface Resource extends GisPointElement, MapElement, PlatformAccess {
    id: string;
    name: string;
    /**
     *     资源类型：
          Camera：监控点
         EncodeDevice：编码设备
         IoTSensor：物联网传感器
     */
    resourceType: string;
    parentResourceId: string;
    description: string;
    createTime: string;
    updateTime: string;
    /**
     * 区域路径(可选)
     */
    regionPath: string;
    /**
     * 区域路径名称(可选)
     */
    regionPathName: string;
    /**
     * 资源标签，用于分类和检索资源(可选)
     */
    labels: ResourceLabel[];
}