import {
  AutoRefreshTimeSpan,
  BusinessParameter,
  IBusiness,
} from "../../../../../common//interface/IBusiness";

import {
  GarbageRetentionNumberData,
  GarbageRetentionNumberDatas,
} from "./garbage-retention-number-data";
import { DivisionRequestService } from "src/app/data-core/repuest/division.service";
import {
  DivisionNumberStatistic,
  GetDivisionStatisticNumbersParams,
} from "src/app/data-core/model/waste-regulation/division-number-statistic";
import { BaseBusinessRefresh } from "src/app/common/tool/base-business-refresh";
import { StatisticalDataBufferService } from "../../buffer/statistical-data-buffer";
import { DivisionType } from "src/app/data-core/model/enum";
import { SessionUser } from "src/app/common/tool/session-user";
import { GarbageStationNumberStatistic } from "src/app/data-core/model/waste-regulation/garbage-station-number-statistic";

export class GarbageRetentionNumberBusiness extends BaseBusinessRefresh {
  user: SessionUser;
  constructor(
    private _statisticalDataBufferService: StatisticalDataBufferService,
    businessParameter?: BusinessParameter
  ) {
    super(_statisticalDataBufferService, businessParameter);
    this.user = new SessionUser();
  }

  getData(): Promise<GarbageRetentionNumberDatas> {
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
    let stations = await (
      this.dataServe as StatisticalDataBufferService
    ).postGarbageStationStatisticNumbers(divisionId);
    let items = new GarbageRetentionNumberDatas();
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
    let children = await (
      this.dataServe as StatisticalDataBufferService
    ).ancestorDivisions(divisionId, undefined, type);
    const datas = await (
      this.dataServe as StatisticalDataBufferService
    ).postDivisionStatisticNumbers(children.map((x) => x.Id));
    let items = new GarbageRetentionNumberDatas();
    for (const data of datas) {
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
  ): GarbageRetentionNumberData {
    let item = new GarbageRetentionNumberData();
    item.Id = data.Id;
    item.Name = data.Name;
    item.Time = data.CurrentGarbageTime;
    if (data instanceof DivisionNumberStatistic) {
      item.Count = data.GarbageDropStationNumber;
    } else {
      item.Count = data.MaxGarbageCount;
    }

    return item;
  }
}
