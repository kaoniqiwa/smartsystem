import { CanType } from "./can-type.model";

/**垃圾投放窗口 */
interface GarbageStationWindow {
  /**窗口编号，从1开始 */
  No: number;

  /**名称 */
  Name?: string;

  /**垃圾桶类型 */
  CanType: CanType;

  /**垃圾桶数量 */
  TrashCanNumber?: number;
}

export { GarbageStationWindow };
