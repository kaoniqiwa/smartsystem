import { DivisionType, UserResourceType } from "src/app/data-core/model/enum";

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

  static Convert(type: UserResourceType) {
    switch (type) {
      case UserResourceType.City:
        return DivisionType.City;
      case UserResourceType.Committees:
        return DivisionType.Committees;
      case UserResourceType.County:
        return DivisionType.County;
      case UserResourceType.Station:
      default:
        return DivisionType.None;
    }
  }
}

/**
 * 页面数据显示模式
 */
export enum PageListMode {
  table,
  list,
}
