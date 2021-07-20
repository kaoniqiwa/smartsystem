export class EnumHelper {
  cameraUsage: { garbageFull: number[]; outside: number[] };
  stationState: { full: number[]; err: number[] };
  constructor() {
    this.cameraUsage = {
      garbageFull: [8, 9, 10, 11, 12, 13, 14, 15],
      outside: [0, 4, 5, 6, 7, 12, 13, 14, 15],
    };

    this.stationState = {
      full: [1, 5, 9, 13],
      err: [2, 3, 6, 7, 10, 11, 14, 15],
    };
  }
}

export enum CanTypeEnum {
  /** 干垃圾桶*/
  Dry = 1,
  /**湿垃圾桶 */
  Wet,
  /** 可回收垃圾桶*/
  Recycle,
  /** 有害垃圾桶*/
  Hazard,
}

export enum ResourceTypeEnum {
  "Camera" = "监控点",
  "EncodeDevice" = "编码设备",
  "IoTSensor" = "物联网传感器",
}

export enum CameraUsageEnum {
  /** 容量检测 */
  Volume = 1,
  /**混合投放 */
  MixedInto,
  /**乱扔垃圾 */
  IllegalDrop,
  /**垃圾满溢 */
  GarbageFull,
}

export enum CameraUsageDataEnum {
  /** 干垃圾桶*/
  Dry = 9,
  /**湿垃圾桶 */
  Wet = 11,
  /** 可回收垃圾桶*/
  Recycle = 9,
  /** 有害垃圾桶*/
  Hazard = 9,

  Other = 4,
}

/**
 * 页面数据显示模式
 */
export enum PageListMode {
  table,
  list,
}
