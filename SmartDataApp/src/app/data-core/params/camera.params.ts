import { ResourcesParams } from "./resources.params";

//查询监控点信息列表
interface CameraParams extends ResourcesParams {
  /**在线状态 */
  OnlineStatus?: number;

  /**摄像机类型 */
  CameraTypes?: number[];

  /**摄像机状态 */
  CameraState?: number;

  /**是否PTZ可控 */
  PTZControllable?: boolean;

  /**是否可存储的 */
  Storable?: boolean;

  /**AI模型ID列表 */
  AIModelIds?: string[];

  /**编码设备 */
  EncodeDeviceIds?: string[];
}

export { CameraParams };
