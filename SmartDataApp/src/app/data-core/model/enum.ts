export enum CanType {
  /** 干垃圾桶*/
  Dry = 1,
  /**湿垃圾桶 */
  Wet,
  /** 可回收垃圾桶*/
  Recycle,
  /** 有害垃圾桶*/
  Hazard,
}

// 摄像机状态
export enum CameraState {
  // 设备故障
  DeviceError = 1,
  // 平台故障
  PlatformError = 2,
}

// 摄像机类型
export enum CameraType {
  // 枪机
  Gun = 1,
  // 球机
  Ball = 2,
  // 半球
  HalfBall = 3,
  // 一体机
  AIO = 4,
}

// 在线状态
export enum OnlineStatus {
  Online = 0,
  Offline = 1,
}

export enum GisType {
  /**
   * WGS84 1
   */
  WGS84 = 1,
  /**
   * CGCS2000 2
   */
  CGCS2000 = 2,
  /**
   * BD09 3
   */
  BD09 = 3,
  /**
   * GCJ02 4
   */
  GCJ02 = 4,
  /**
   * 西安80 5
   */
  XA80 = 5,
  /**
   * 北京54 6
   */
  BJ54 = 6,
  /**
   * 其他 7
   */
  Other = 7,
}

export enum DivisionType {
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

/**
 *  事件类型
 *
 * @export
 * @enum {number}
 */
export enum EventType {
  /**
   * 	乱扔垃圾事件	1
   */
  IllegalDrop = 1,
  /**
   *	混合投放事件	2
   */
  MixedInto = 2,
  /**
   *	垃圾容量事件	3
   */
  GarbageVolume = 3,
  /**
   *	垃圾满溢事件	4
   */
  GarbageFull = 4,
  /**
   *	小包垃圾落地	5
   */
  GarbageDrop = 5,
  /**
   *	小包垃圾滞留	6
   */
  GarbageDropTimeout = 6,
  /**
   *	小包垃圾处置完成	7
   */
  GarbageDropHandle = 7,
}

export enum Gender {
  /**
   *  男
   */
  Male = 1,
  /**
   *  女
   */
  Female = 2,
}

/**
 * 垃圾房状态
 *
 * @export
 * @enum {number}
 */
export enum StationState {
  /**
   *	满溢	1
   */
  Full = 1,
  /**
   *	异常	2
   */
  Error = 2,
}
export enum CameraUsage {
  /** 容量检测 */
  Volume = 1,
  /**混合投放 */
  MixedInto = 2,
  /**乱扔垃圾 */
  IllegalDrop = 3,
  /**垃圾满溢 */
  GarbageFull = 4,
}
export enum CameraUsageData {
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
export enum ResourceType {
  /**
   *  监控点
   */
  Camera = "Camera",
  /**
   *  编码设备
   */
  EncodeDevice = "EncodeDevice",
  /**
   *  物联网传感器
   */
  IoTSensor = "IoTSensor",
  /**
   *  垃圾房
   */
  GarbageStation = "GarbageStation",
}
