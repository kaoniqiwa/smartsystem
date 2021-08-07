import { Camera } from "./camera.model";

interface GarbageStationCamera extends Camera {
  /**垃圾桶房 */
  GarbageStationId: string;

  /**
   * 位置编号(可选)
   * 箱外：1-9
   * 箱内：11-19
   * 11,15：干垃圾
   * 12：湿垃圾
   * 13：可回收垃圾
   * 14：有害垃圾
   */
  PositionNo?: number;

  /**垃圾满溢照片路径 */
  GarbageFullImageUrl?: string;

  /**垃圾满溢时间 */
  GarbageFullTime?: Date | string;

  /**是否满溢 */
  IsFull?: boolean;
}

export { GarbageStationCamera };
