import { GetResourcesParams } from "./resources-params";

/**
 *
 */
export class GetCamerasParams extends GetResourcesParams {
  OnlineStatus?: number;
  CameraTypes: number[];
  CameraState?: number;
  IPAddress: string;
  /**
   * 是否PTZ可控(可选)
   */
  PTZControllable?: boolean;
  /**
   * 是否可存储的(可选)
   */
  Storable?: boolean;
  /**
   * AI模型ID列表(可选)
   */
  AIModelIds: string[];
}
