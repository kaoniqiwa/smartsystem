import { GetResourcesParams } from "./resources-params";

/**
 *
 */
export class GetCamerasParams extends GetResourcesParams {
  EncodeDeviceIds: string[];
  /**
   *
   */
  OnlineStatus?: number;
  CameraTypes: number[];
  CameraState?: number;
  IPAddress: string;
  /**
   *
   */
  PTZControllable?: boolean;
  /**
   *
   */
  Storable?: boolean;
  /**
   *
   */
  AIModelIds: string[];
}

/**
 *
 */
export class GetEncodeDevicesParams extends GetResourcesParams {
  OnlineStatus?: number;
  Model: string;
  /**
   *
   */
  SerialNumber: string;
  /**
   *
   */
  DeviceType: string;
  /**
   *
   */
  IPAddress: string;
}
