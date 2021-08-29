import { IViewModel } from "src/app/common/abstract/base-view";

export interface GarbageRetentionRankData {
  id: string;
  name: string;
  time: number;
  count: number;
}

export interface GarbageRetentionRankDatas {
  datas: GarbageRetentionRankData[];
}

export enum RetentionType {
  time = 0,
  count = 1,
}

export interface OptionModel {
  id: string;
  content: string;
}
