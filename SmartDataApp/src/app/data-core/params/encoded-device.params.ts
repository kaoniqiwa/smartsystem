import { ResourcesParams } from "./resources.params";

// 查询编码设信息列表;
interface EncodedDeviceParams extends ResourcesParams {
  /**在线状态 */
  OnlineStatus?: number;

  /**型号，支持LIKE */
  Model?: string;

  /**序列号，支持LIKE */
  SerialNumber?: string;

  /**设备类型 */
  DeviceType?: string;

  /**IP地址，支持LIKE */
  IPAddress?: string;
}

export { EncodedDeviceParams };
