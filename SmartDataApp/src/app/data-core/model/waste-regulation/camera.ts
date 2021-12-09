import { Transform } from "class-transformer";
import { CameraUsage, OnlineStatus } from "../enum";
import { transformDateTime } from "../transformer";

/**摄像机信息 */
export class Camera {
  /**摄像机ID */
  Id: string;
  /**摄像机名称 */
  Name: string;
  /**摄像机用途 */
  CameraUsage: number;
  /**创建时间 */
  @Transform(transformDateTime)
  CreateTime: Date = new Date();
  /**更新事件 */
  @Transform(transformDateTime)
  UpdateTime: Date = new Date();
  /**垃圾桶房ID */
  GarbageStationId: string;
  /**位置编号，
箱外：1-9
箱内：11-19
11,15：干垃圾
12：湿垃圾
13：可回收物
14：有害垃圾 */
  PositionNo: number;

  OnlineStatus: number;
  // 照片URL或ID	O
  ImageUrl?: string;
  // 照片时间	O
  @Transform(transformDateTime)
  ImageTime?: Date;
}

/**获取摄像机列表参数 */
export class GetGarbageStationCamerasParams {
  /**页码[1-n](可选) */
  PageIndex?: number;
  /**分页大小[1-100](可选) */
  PageSize?: number;
  /**摄像机ID(可选) */
  Ids?: string[];
  /**垃圾房ID(可选) */
  GarbageStationIds?: string[];
  /**摄像机名称(可选) */
  Name?: string;
  /**摄像机用途(可选) */
  CameraUsage?: number;

  OnlineStatus?: OnlineStatus;

  DivisionIds?: string[];

  /**	String[]	所属网格	O */
  GridCellIds?: string[];
  /**	String[]	所属小区	O */
  CommunityIds?: string[];
}
