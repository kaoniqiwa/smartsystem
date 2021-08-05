import { Transform, Type } from "class-transformer";
import { DateTime, transformDateTime } from "../date-time";
import { DivisionType, GisType } from "../enum";

/**区划信息 */
export class Division {
  /**区划ID */
  Id!: string;
  /**区划名称 */
  Name!: string;
  /**父区划ID(可选)，如果是根区域节点，则该ID为空 */
  ParentId: string;
  /**是否为叶节点的区域 */
  IsLeaf!: boolean;
  /**外部扩展ID(可选)，用于国标区划编码 */
  ExternalId: string;
  /**区划完整路径(可选)，含本节点，@进行分割，上级节点在前 */
  DivisionPath: string;
  /**描述信息(可选) */
  Description: string;
  /**人口(可选) */
  Population?: number;
  /**区划类型，用于图标区分 */
  DivisionType!: DivisionType;
  /**创建时间 */
  @Transform(transformDateTime)
  CreateTime: DateTime;
  /**更新事件 */
  @Transform(transformDateTime)
  UpdateTime: DateTime;
  /**区划中心GIS点位(可选) */
  @Type(() => GisPoint)
  GisPoint?: GisPoint;
  /**区划GIS点位区域(可选) */
  @Type(() => GisArea)
  GisArea?: GisArea;
}
export class GisArea {
  /**
   *	GisPoint[]	坐标点	M
   *
   * @type {GisPoint[]}
   * @memberof GisArea
   */
  GisPoint: GisPoint[];
  /**
   *	Int32	坐标系类型	M
   *
   * @type {number}
   * @memberof GisArea
   */
  GisType: number;
}
export class GisPoint {
  constructor(point?: number[], type?: GisType) {
    if (point) {
      this.Longitude = point[0];
      this.Latitude = point[1];
    }
    if (type) {
      this.GisType = type;
    }
  }

  /**
   * Double	经度	M
   *
   * @type {number}
   * @memberof GisPoint
   */
  Longitude: number;
  /**
   *	Double	纬度	M
   *
   * @type {number}
   * @memberof GisPoint
   */
  Latitude: number;
  /**
   *	Double	高度	M
   *
   * @type {number}
   * @memberof GisPoint
   */
  Altitude: number = 0;
  /**
   *	Int32	楼层	O
   *
   * @type {number}
   * @memberof GisPoint
   */
  Floor?: number;
  /**
   *	Int32	坐标系类型	O
   *
   * @type {number}
   * @memberof GisPoint
   */
  GisType?: GisType;
}

/**获取区划列表参数 */
export class GetDivisionsParams {
  /**页码[1-n](可选) */
  PageIndex?: number;
  /**分页大小[1-100](可选) */
  PageSize?: number;
  /**区划ID(可选) */
  Ids?: string[];
  /**区划名称，支持LIKE(可选) */
  Name?: string;
  /**区划类型(可选) */
  DivisionType?: DivisionType;
  /**父ID(可选) */
  ParentId?: string;
  /**区划完整路径(可选)，含本节点，@进行分割，上级节点在前，支持LIKE */
  DivisionPath?: string;
  /**祖辈ID(可选)，返回该ID下的所有子孙区划信息 */
  AncestorId?: string;
}
