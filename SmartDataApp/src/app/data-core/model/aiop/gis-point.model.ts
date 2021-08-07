//地理信息坐标点
interface GisPoint {
  /**经度 */
  Longitude: number;

  /**纬度 */
  Latitude: number;

  /**高度 */
  Altitude: number;

  /**楼层 */
  Floor?: number;

  /**坐标系类型 */
  GisType?: number;
}

export { GisPoint };
