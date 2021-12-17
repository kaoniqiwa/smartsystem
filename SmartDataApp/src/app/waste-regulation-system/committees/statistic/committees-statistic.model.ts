import { EventType } from "src/app/data-core/model/enum";

export class CommitteesStatisticViewModel {
  /** 全部设备 */
  CameraCount: number = 0;
  /** 在线设备 */
  OnlineCount: number = 0;
  /** 离线设备 */
  OfflineCount: number = 0;
  /** 投放点设备 */
  StationCount: number = 0;
  /** 滞留投放点 */
  StationDropCount: number = 0;
  /** 满溢投放点 */
  StationFullCount: number = 0;
  /** 垃圾落地 */
  IllegalDropCount: number = 0;
  /** 混合投放 */
  MixedIntoCount: number = 0;
}
