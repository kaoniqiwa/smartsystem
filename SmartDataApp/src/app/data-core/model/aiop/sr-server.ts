/**/ //  */
export class SRServer {
  /**服务器ID */
  Id: string;
  /**服务器名称 */
  Name: string;
  /**协议类型：Howell */
  ProtocolType: string;
  /**用户名(可选) */
  Username: string;
  /**密码(可选) */
  Password: string;
  /**地址列表(可选) */
  Addresses: SRServerAddress[];
}

/**服务器地址列表 */
export class SRServerAddress {
  /**IP地址 */
  IPAddress: string;
  /**端口号 */
  Port: number;
  /**是否为互联网IP */
  IsInternet: boolean;
  /**RTSP端口号(可选)，默认554 */
  RtspPort?: number;
  /**RTMP端口号(可选)，默认1935 */
  RtmpPort?: number;
  /**HTTP端口号(可选)，默认和服务器端口号相同 */
  HttpPort?: number;
  /**Websocket端口号(可选)，默认和服务器端口号相同 */
  WsPort?: number;
  /**是否为默认IP */
  IsDefault: boolean;
}
