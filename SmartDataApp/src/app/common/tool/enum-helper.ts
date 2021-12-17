import { DivisionType, UserResourceType } from "src/app/data-core/model/enum";

export class EnumHelper {
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
