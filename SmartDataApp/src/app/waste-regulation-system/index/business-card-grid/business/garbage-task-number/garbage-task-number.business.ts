import {
  AutoRefreshTimeSpan,
  BusinessParameter,
  IBusiness,
} from "../../../../../common//interface/IBusiness";

import {
  GarbageTaskNumberData,
  GarbageTaskNumberDatas,
} from "./garbage-task-number-data";
import { DivisionRequestService } from "src/app/data-core/repuest/division.service";
import {
  DivisionNumberStatistic,
  GetDivisionStatisticNumbersParams,
} from "src/app/data-core/model/waste-regulation/division-number-statistic";
import { BaseBusinessRefresh } from "src/app/common/tool/base-business-refresh";
import { StatisticalDataBufferService } from "../../buffer/statistical-data-buffer";
import { DivisionType, EventType } from "src/app/data-core/model/enum";
import { SessionUser } from "src/app/common/tool/session-user";
import { GarbageStationNumberStatistic } from "src/app/data-core/model/waste-regulation/garbage-station-number-statistic";

export class GarbageTaskNumberBusiness extends BaseBusinessRefresh {
  user: SessionUser;
  constructor(
    dataServe: StatisticalDataBufferService,
    businessParameter?: BusinessParameter
  ) {
    super(dataServe, businessParameter);
    this.user = new SessionUser();
  }

  getData(): Promise<GarbageTaskNumberDatas> {
    let divisionId = this.businessParameter.divisionId;
    let divisionType = this.businessParameter.divisionType;

    if (!divisionId) {
      divisionId = this.user.userDivision[0].Id;
    }
    if (!divisionType) {
      divisionType = this.user.userDivisionType;
    }

    switch (divisionType) {
      case DivisionType.Committees:
        return this.getDataOfCommittees(divisionId);
      case DivisionType.County:
        return this.getDataOfCounty(divisionId);
      case DivisionType.City:
        return this.getDataOfCity(divisionId);
      default:
        throw Error();
    }
  }
  /** 居委会 */
  async getDataOfCommittees(divisionId: string) {
    let self = await (
      this.dataServe as StatisticalDataBufferService
    ).postDivisionStatisticNumbers([divisionId]);

    let stations = await (
      this.dataServe as StatisticalDataBufferService
    ).postGarbageStationStatisticNumbers(divisionId);
    let items = new GarbageTaskNumberDatas();
    if (self && self.length > 0) {
      let selfItem = this.convert(self[0]);
      items.push(selfItem);
    }
    for (let i = 0; i < stations.length; i++) {
      const station = stations[i];
      let item = this.convert(station);
      items.push(item);
    }
    return items;
  }
  /** 街道 */
  async getDataOfCounty(
    divisionId: string,
    type: DivisionType = DivisionType.Committees
  ) {
    let self = await (
      this.dataServe as StatisticalDataBufferService
    ).postDivisionStatisticNumbers([divisionId]);

    let children = await (
      this.dataServe as StatisticalDataBufferService
    ).getAncestorDivisions(divisionId, type);

    const datas = await (
      this.dataServe as StatisticalDataBufferService
    ).postDivisionStatisticNumbers(children.map((x) => x.Id));
    let items = new GarbageTaskNumberDatas();
    if (self && self.length > 0) {
      let selfItem = this.convert(self[0]);
      items.push(selfItem);
    }
    for (const data of datas) {
      if (data.StationNumber <= 0) continue;
      let item = this.convert(data);
      items.push(item);
    }
    return items;
  }
  /** 行政区 */
  getDataOfCity(divisionId: string) {
    return this.getDataOfCounty(divisionId, DivisionType.County);
  }

  private convert(
    data: GarbageStationNumberStatistic | DivisionNumberStatistic
  ): GarbageTaskNumberData {
    let item = new GarbageTaskNumberData();
    item.Id = data.Id;
    item.Name = data.Name;
    if (data.TodayEventNumbers) {
      let garbageDrop = data.TodayEventNumbers.find(
        (x) => x.EventType == EventType.GarbageDrop
      );
      if (garbageDrop) {
        item.GarbageDropCount = garbageDrop.DayNumber;
      }
      let garbageDropHandle = data.TodayEventNumbers.find(
        (x) => x.EventType == EventType.GarbageDropHandle
      );
      if (garbageDropHandle) {
        item.GarbageDropHandleCount = garbageDropHandle.DayNumber;
      }
      let garbageDropTimeout = data.TodayEventNumbers.find(
        (x) => x.EventType == EventType.GarbageDropTimeout
      );
      if (garbageDropTimeout) {
        item.GarbageDropTimeoutCount = garbageDropTimeout.DeltaNumber;
      }
    }

    item.TotalTaskCount = data.TotalTaskCount ? data.TotalTaskCount : 0;
    item.TimeoutTaskCount = data.TimeoutTaskCount ? data.TimeoutTaskCount : 0;
    item.CompleteTaskCount = data.CompleteTaskCount
      ? data.CompleteTaskCount
      : 0;
    return item;
  }
}
