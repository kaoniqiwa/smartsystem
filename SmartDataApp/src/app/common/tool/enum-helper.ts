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

/**
 * 页面数据显示模式
 */
export enum PageListMode {
  table,
  list,
}
