import { Resource } from "./Resource";
import { GisPoint } from "./igis-point";


    /**
     * 地图元素信息
     */
export class MapElement {
    Id: string;
    Name: string;
    Description: string;
    CreateTime: string;
    UpdateTime: string;
    /**
     *  区域路径(可选)
     */
    RegionPath: string;
    /**
     *  区域路径名称(可选)
     */
    RegionPathName: string;
    GisPoint: GisPoint;
    ElementType: number;
    MapId: string;
    /**
     *  资源集合(可选)
     */
    Resources: Resource[];
}