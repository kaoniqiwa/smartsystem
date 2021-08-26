import { IBusinessData } from "../../../../../common/interface/IBusiness";
export class StationsScoreInfo implements IBusinessData {
  items: StationScoreInfo[];
}

export class StationScoreInfo {
  id: string;
  station: string;
  score: number;
  unit: string;
}
