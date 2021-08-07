import { CanType } from "./can-type.model";

enum LidState {
  open = 1,
  close = 1,
}
/**垃圾桶信息 */
interface TrashCan {
  /**垃圾桶ID */
  Id: string;

  /**垃圾桶名称 */
  Name?: string;

  /**垃圾桶编号 */
  No?: string;

  /**垃圾桶类型 */
  CanType: CanType;

  /**容积，单位：L */
  MaxVolume: number;

  /**当前容积(可选)，单位：L */
  CurrentVolume?: number;

  /**创建时间 */
  CreateTime: Date | string;

  /**更新事件 */
  UpdateTime: Date | string;

  /**垃圾桶房ID */
  GarbageStationId: string;

  /**摄像机ID */
  CameraId?: string;

  /**垃圾桶盖子状态(可选)，0：打开，1：关闭 */
  LidState?: LidState;
}
export { TrashCan };
