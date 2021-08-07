/**平台信息 */
interface Platform {
  /**平台ID */
  Id: string;

  /**平台名称*/
  Name?: string;

  /**用户名，AccessID */
  Username?: string;

  /**密码，AccessKEY */
  Password?: string;

  /**协议类型:Artemis */
  ProtocolType: string;

  /**连接地址 */
  Url: string;

  /**软件版本 */
  SoftwareVersion?: string;

  /**状态 */
  State: PlatFormState;

  /**创建时间 */
  CreateTime: Date | string;

  /**更新时间 */
  UpdateTime: Date | string;

  /**事件接收端口号(可选) */
  EventRecvPort?: number;

  /**事件接收的本地IP地址(可选) */
  EventRecvIPAddress: string;

  /**订阅事件编码列表(可选) */
  EventCodes: number[];
}

/**0-正常，1-故障 */
enum PlatFormState {
  normal = 0,
  error = 1,
}

export { Platform };
