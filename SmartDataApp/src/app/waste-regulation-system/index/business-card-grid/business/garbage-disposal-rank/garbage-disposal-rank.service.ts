import {
  StatisticalDataBufferService,
  TimeUnitEnum,
} from "../../buffer/statistical-data-buffer";
import { StationsScoreInfo, StationScoreInfo } from "./data";
import { BusinessParameter } from "../../../../../common/interface/IBusiness";
import { BaseBusinessRefresh } from "../../../../../common/tool/base-business-refresh";

/**
 * 投放点 处置排名
 */
export class GarbageDisposalRankService extends BaseBusinessRefresh {
  constructor(
    dataServe: StatisticalDataBufferService,
    businessParameter?: BusinessParameter
  ) {
    super(dataServe, businessParameter);
  }

  async getData() {
    const model = new StationsScoreInfo();
    model.items = new Array();
    const divisionId = this.businessParameter.divisionId as string, //父区划
      stations = await (
        this.dataServe as StatisticalDataBufferService
      ).getGarbageStations(divisionId),
      stationIds = new Array<string>();
    if (stations.length) {
      stations.map((s) => stationIds.push(s.Id));
      const statistic = await (
        this.dataServe as StatisticalDataBufferService
      ).stationNumberStatistic(stationIds);
      statistic.map((s) => {
        const info = new StationScoreInfo();
        model.items.push(info);
        info.station = s.Name;
        info.id = s.Id;
        info.score = s.GarbageRatio;
        info.unit = "分";
      });
    }

    return model;
  }
}
