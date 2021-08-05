import { GarbageStationWindow } from "./garbage-station-window";
import { CameraSlot } from "./camera-slot";
<<<<<<< HEAD
import { Transform } from "class-transformer";
import { transformDate } from "../transformer";
=======
import { DateTime, transformDateTime } from "../date-time";
import { Transform } from "class-transformer";
>>>>>>> c569db68c90a18169ce619cfbceded4620335126
/**垃圾房类型信息 */
export class GarbageStationType {
  /**垃圾房类型，从1开始 */
  Type: number = 0;
  /**类型名称 */
  Name: string = "";
  /**描述信息(可选) */
  Description?: string;
  /**创建时间 */
<<<<<<< HEAD
  @Transform(transformDate)
  CreateTime!: Date;
  /**更新事件 */
  @Transform(transformDate)
  UpdateTime!: Date;
=======
  @Transform(transformDateTime)
  CreateTime!: DateTime;
  /**更新事件 */
  @Transform(transformDateTime)
  UpdateTime!: DateTime;
>>>>>>> c569db68c90a18169ce619cfbceded4620335126
  /**垃圾投放窗口列表(可选) */
  Windows?: GarbageStationWindow[];
  /**摄像机插槽列表(可选) */
  CameraSlots?: CameraSlot[];
}
