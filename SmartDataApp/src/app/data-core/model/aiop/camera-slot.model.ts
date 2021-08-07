/**摄像机槽位 */
interface CameraSlot {
  /**槽位编号，从1开始 */
  No: number;

  /**名称*/
  Name?: string;

  /**摄像机用途 */
  CameraUsage: number;

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

  /**是否厢房内部 */
  Inside?: boolean;

  /**关联的投放窗口编号 */
  Windows?: number[];
}

export { CameraSlot };
