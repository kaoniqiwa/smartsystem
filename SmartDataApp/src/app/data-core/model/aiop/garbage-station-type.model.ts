import { CameraSlot } from "./camera-slot.model";
import { GarbageStationWindow } from "./garbage-station-window.model";

interface GarbageStationType {
  /**垃圾房类型 */
  Type: number;

  /**类型名称 */
  Name: string;

  /**描述信息 */
  Description?: string;

  /**创建时间 */
  CreateTime: Date | string;

  /**更新事件 */
  UpdateTime: Date | string;

  /**垃圾投放窗口列表(可选) */
  Windows: GarbageStationWindow[];

  /**摄像机插槽列表(可选) */
  CameraSlots: CameraSlot[];
}

export { GarbageStationType };
