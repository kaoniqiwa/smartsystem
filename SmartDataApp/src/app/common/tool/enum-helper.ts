import { EventType } from "src/app/data-core/model/waste-regulation/event-number";

export class EnumHelper {
  cameraType: Map<number, string>;
  cameraState: Map<number, string>;
  eventType: Map<number, string>;
  cameraUsage: { garbageFull: number[]; outside: number[] };
  stationState: { full: number[]; err: number[] };
  constructor() {
    this.cameraState = new Map();
    this.cameraType = new Map();
    this.eventType = new Map();
    this.cameraType.set(1, "枪机");
    this.cameraType.set(2, "球机");
    this.cameraType.set(3, "半球");
    this.cameraType.set(4, "一体机");

    this.cameraState.set(1, "设备故障");
    this.cameraState.set(2, "平台故障");

    this.eventType.set(EventType.IllegalDrop, "乱丢垃圾");
    this.eventType.set(EventType.MixedInto, "混合投放");
    this.eventType.set(EventType.GarbageVolume, "垃圾容量");
    this.eventType.set(EventType.GarbageFull, "垃圾满溢");

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

export enum DivisionTypeEnum {
  None,
  Province,
  /**区 */
  City,
  /**县、街道 */
  County,
  /**	居委会 */
  Committees,
  Village,
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
