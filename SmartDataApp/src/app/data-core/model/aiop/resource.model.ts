import { GisPoint } from "./gis-point.model";
import { PlatformAssociation } from "./platform-association.model";

// 资源类型
enum ResourceType {
  Camera = "Camera", //监控点
  EncodeDevice = "EncodeDevice", //编码设备
  IoTSensor = "IoTSensor", //物联网传感器
}

//资源标签
interface ResourceLabel {
  /**唯一标识符 */
  Id: string;

  /**资源名称 */
  Name: string;
}

/**资源信息 */
interface Resource {
  /**唯一标识符 */
  Id: string;

  /**资源名称 */
  Name: string;

  /**资源类型 */
  ResourceType: ResourceType;

  /**父资源节点ID */
  ParentResourceId?: string;

  /**描述 */
  Description?: string;

  /**创建时间 */
  CreateTime: Date | string;

  /**更新事件 */
  UpdateTime: Date | string;

  /**区域路径 */
  RegionPath?: string;

  /**区域路径名称 */
  RegionPathName?: string;

  /**GIS坐标 */
  gisPoint?: GisPoint;

  /**平台关联信息 */
  Platform?: PlatformAssociation;

  /**资源标签，用于分类和检索资源 */
  Labels?: ResourceLabel[];

  /**所属地图元素ID */
  MapElementId?: string;

  /**所属区域ID */
  RegionId?: string;
}

export { Resource };
