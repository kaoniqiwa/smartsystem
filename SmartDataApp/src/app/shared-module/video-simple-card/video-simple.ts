/**
 * Developer 施文斌
 * LastUpdateTime 2020/7/7
 */
import { HowellUri } from "src/app/common/howell-uri";
import { IViewModel } from "../../common/abstract/base-view";
export class VideoSimpleModel implements IViewModel {
  title?: string;
  // 链接地址
  host: string;
  // 端口号
  port: number;
  // 摄像机id
  deviceId: string;
  // 通道号
  slot: string;
  // 用户名
  userName: string;
  // 密码
  password: string;
  // 模式
  mode: VideoMode;
  // 开始时间
  beginTime: string;
  // 结束时间
  endTime: string;
  constructor(
    options?:
      | {
          title?: string;
          host?: string;
          deviceId?: string;
          slot?: string;
          userName?: string;
          password?: string;
          mode?: VideoMode;
          beginTime?: string;
          endTime?: string;
        }
      | string
  ) {
    if (options) {
      if (typeof options === "string") {
        this.fromString(options);
      } else {
        this.title = options.title;
        this.host = options.host;
        this.deviceId = options.deviceId;
        this.slot = options.slot;
        this.userName = options.userName;
        this.password = options.password;
        this.mode = options.mode;
        this.beginTime = options.beginTime;
        this.endTime = options.endTime;
      }
    }
  }

  fromString(str: string) {
    let url = new HowellUri(str);
    this.host = url.Host;
    this.port = url.Port;
    if (url.Querys) {
      this.userName = url.Querys.user;
      this.password = url.Querys.password;
    }

    let uri = str.substr(str.indexOf(url.Authority) + url.Authority.length + 1);
    let nodes = uri.split("/");

    this.mode = nodes[3] as VideoMode;
    this.deviceId = nodes[4];
    this.slot = nodes[5];

    switch (this.mode) {
      case VideoMode.live:
        break;
      case VideoMode.vod:
        let interval = nodes[7];
        let times = interval.split("_");
        this.beginTime = times[0];
        this.endTime = times[1];
        break;

      default:
        break;
    }
  }

  toString() {
    let url = `ws://${this.host}:${this.port}/ws/video/howellps/${this.mode}/${this.deviceId}/${this.slot}/1/${this.mode}.mp4?user=${this.userName}&password=${this.password}`;
    if (this.mode === VideoMode.vod) {
      url = `ws://${this.host}:${this.port}/ws/video/howellps/${this.mode}/${this.deviceId}/${this.slot}/1/${this.beginTime}_${this.endTime}/${this.mode}.mp4?user=${this.userName}&password=${this.password}`;
    }
    return url;
  }
}

export enum VideoMode {
  live = "live",
  vod = "vod",
}
