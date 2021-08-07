import { Resource } from "./resource.model";

enum TransType {
  UDP = 0,
  TCP = 1,
}

/**0-正常，1-离线 */
enum OnlineStatus {
  online = 0,
  offline = 1,
}

/**编码设备信息 */
interface EncodeDevice extends Resource {
  /**传输类型*/
  TransType?: number;

  /**协议类型 Howell，Hikvision，UniView */
  ProtocolType?: string;

  /**状态 */
  OnlineStatus?: OnlineStatus;

  /**型号 */
  Model?: string;

  /**序列号*/
  SerialNumber?: string;

  /**厂商 */
  Manufactory?: string;

  /**连接地址*/
  Url: string;

  /**用户名 */
  Username?: string;

  /**密码 */
  Password?: string;

  /**能力 */
  CapabilitySet?: string[];

  /**能力名称 */
  CapabilitySetName?: string[];

  /**固件版本号 */
  FirmwareVersion?: string;

  /**固件版本号 */
  SoftwareVersion?: string;

  /**固件版本号 */
  HardwareVersion?: string;

  /**设备类型 NVR，IPC，DVS */
  DeviceType?: string;

  SRSId?: string; //String	流媒体ID

  SRServerId?: string; //String	流媒体服务器ID
}

export { EncodeDevice };
