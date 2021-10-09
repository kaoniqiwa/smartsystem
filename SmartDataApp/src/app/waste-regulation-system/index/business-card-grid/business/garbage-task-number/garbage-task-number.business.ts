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
import { GlobalStoreService } from "src/app/shared-module/global-store.service";

export class GarbageTaskNumberBusiness extends BaseBusinessRefresh {
  user: SessionUser;
  constructor(
    dataServe: StatisticalDataBufferService,
    businessParameter?: BusinessParameter
  ) {
    super(dataServe, businessParameter);
    this.user = new SessionUser();
  }

  getData(
    divisionId: string = this.businessParameter.divisionId ||
      GlobalStoreService.divisionId,
    divisionType: DivisionType = this.businessParameter.divisionType ||
      GlobalStoreService.divisionType,
    hasSelf = true
  ): Promise<GarbageTaskNumberDatas> {
    switch (divisionType) {
      case DivisionType.Committees:
        return this.getDataOfCommittees(divisionId, hasSelf);
      case DivisionType.County:
        return this.getDataOfCounty(
          divisionId,
          DivisionType.Committees,
          hasSelf
        );
      case DivisionType.City:
        return this.getDataOfCity(divisionId, hasSelf);
      default:
        throw Error();
    }
  }

  async getDataOfDivision(divisionId: string) {
    let self = await (
      this.dataServe as StatisticalDataBufferService
    ).postDivisionStatisticNumbers([divisionId]);
    if (self && self.length > 0) {
      return this.convert(self[0]);
    }
  }

  /** 居委会 */
  async getDataOfCommittees(divisionId: string, hasSelf = true) {
    let items = new GarbageTaskNumberDatas();
    if (hasSelf) {
      let self = await this.getDataOfDivision(divisionId);
      if (self) {
        items.push(self);
      }
    }
    let stations = await (
      this.dataServe as StatisticalDataBufferService
    ).postGarbageStationStatisticNumbers(divisionId);

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
    type: DivisionType = DivisionType.Committees,
    hasSelf = true
  ) {
    let items = new GarbageTaskNumberDatas();
    if (hasSelf) {
      let self = await this.getDataOfDivision(divisionId);
      if (self) {
        items.push(self);
      }
    }
    let children = await (
      this.dataServe as StatisticalDataBufferService
    ).getAncestorDivisions(divisionId, type);

    const datas = await (
      this.dataServe as StatisticalDataBufferService
    ).postDivisionStatisticNumbers(children.map((x) => x.Id));

    for (const data of datas) {
      if (data.StationNumber <= 0) continue;
      let item = this.convert(data);
      items.push(item);
    }
    return items;
  }
  /** 行政区 */
  getDataOfCity(divisionId: string, hasSelf = true) {
    return this.getDataOfCounty(divisionId, DivisionType.County, hasSelf);
  }

  convert(
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
