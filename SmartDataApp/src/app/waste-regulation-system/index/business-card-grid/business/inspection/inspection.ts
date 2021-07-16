import { StatisticalDataBufferService } from "../../buffer/statistical-data-buffer";
import { GarbageStationInspection } from "./data";
import { BusinessParameter } from "../../../../../common/interface/IBusiness";
import { BaseBusinessRefresh } from "../../../../../common/tool/base-business-refresh";
export class GarbageInspection extends BaseBusinessRefresh {
  constructor(
    dataServe: StatisticalDataBufferService,
    businessParameter?: BusinessParameter
  ) {
    super(dataServe, businessParameter);
  }

  async getData() {
    const divisionsId = this.businessParameter.map.get("divisionId"),
      stationId = this.businessParameter.map.get("stationId"), //第一个显示
      model = new GarbageStationInspection(),
      garbageStations = await (
        this.dataServe as StatisticalDataBufferService
      ).getGarbageStations(divisionsId);
    if (stationId) {
      model.garbageStations = garbageStations.filter((g) => g.Id == stationId);
      garbageStations
        .filter((g) => g.Id != stationId)
        .map((s) => model.garbageStations.push(s));
    } else model.garbageStations = garbageStations;
    const stationIds = new Array<string>();
    garbageStations.map((x) => stationIds.push(x.Id));
    const events = await (
      this.dataServe as StatisticalDataBufferService
    ).getStationsIllegalDropEvent(stationIds);

    if (events && events.Data) model.todayStationsEvent = events.Data;
    return model;
  }
}
