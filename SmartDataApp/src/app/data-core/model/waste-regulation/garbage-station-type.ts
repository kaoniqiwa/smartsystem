import { GarbageStationWindow } from "./garbage-station-window";
import { CameraSlot } from "./camera-slot";
import { Transform } from "class-transformer";
import { transformDateTime } from "../transformer";
/**垃圾房类型信息 */
export class GarbageStationType {
  /**垃圾房类型，从1开始 */
  Type: number = 0;
  /**类型名称 */
  Name: string = "";
  /**描述信息(可选) */
  Description?: string;
  /**创建时间 */
  @Transform(transformDateTime)
  CreateTime!: Date;
  /**更新事件 */
  @Transform(transformDateTime)
  UpdateTime!: Date;
  /**垃圾投放窗口列表(可选) */
  Windows?: GarbageStationWindow[];
  /**摄像机插槽列表(可选) */
  CameraSlots?: CameraSlot[];
}
