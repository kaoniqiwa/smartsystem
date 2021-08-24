/**
 * Developer 施文斌
 * LastUpdateTime 2020/7/7
 */

import { TimeSpan } from "../tool/time-span";
export interface IBusinessData {}

export class AutoRefreshTimeSpan extends TimeSpan {}

export interface IBusiness<T extends IBusinessData> {
  dataChanged: (data: T) => void /**数据改变 */;
  timeSpan: AutoRefreshTimeSpan;
  disposing: (self: this) => void;
  getData(): T;
}

export interface IEventBusiness<T extends IBusinessData> extends IBusiness<T> {
  eventRules: (event: any) => boolean;
}

export interface IBusinessRefresh extends IBusiness<IBusinessData> {}

export class BusinessParameter {
  [key: string]: any;
}
