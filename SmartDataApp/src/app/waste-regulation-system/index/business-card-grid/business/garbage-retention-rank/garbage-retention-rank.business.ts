import { BusinessParameter } from "../../../../../common/interface/IBusiness";

import { BaseBusinessRefresh } from "src/app/common/tool/base-business-refresh";
import { StatisticalDataBufferService } from "../../buffer/statistical-data-buffer";
import { DivisionType } from "src/app/data-core/model/enum";
import { SessionUser } from "src/app/common/tool/session-user";
import { GarbageRetentionRankData } from "src/app/shared-module/card-component/garbage-retention-rank/garbage-retention-rank.model";

export class GarbageRetentionRankBusiness extends BaseBusinessRefresh {
  user: SessionUser;
  constructor(
    private _statisticalDataBufferService: StatisticalDataBufferService,
    businessParameter?: BusinessParameter
  ) {
    super(_statisticalDataBufferService, businessParameter);
    this.user = new SessionUser();
  }

  getData(): Promise<GarbageRetentionRankData[]> {
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
      // return this.getDataOfCommittees(divisionId);
      case DivisionType.County:
        return this.getDataOfCounty(divisionId);
      case DivisionType.City:
        return this.getDataOfCity(divisionId);
      default:
        throw Error();
    }
  }
  /**
   * 拉取居委会下的所有厢房统计信息
   */
  async getDataOfCommittees(divisionId: string) {
    // 当前居委会下的所有厢房
    let garbageStations =
      await this._statisticalDataBufferService.postGarbageStationStatisticNumbers(
        divisionId
      );
    console.log("垃圾厢房", garbageStations);
    // // let items = new GarbageRetentionNumberDatas();
    // // for (let i = 0; i < garbageStations.length; i++) {
    // //   const station = garbageStations[i];
    // //   let item = this.convert(station);
    // //   items.push(item);
    // // }
    // return items;
  }

  /**
   * 拉取街道下的所有居委会统计信息
   */
  async getDataOfCounty(
    divisionId: string,
    type: DivisionType = DivisionType.Committees
  ) {
    // 获取 DivisionId 下的所有区划
    let divisions =
      await this._statisticalDataBufferService.getAncestorDivisions(
        divisionId,
        type
      );
    // console.log("divisions", divisions);
    // 获取所有区划的统计信息
    const divisionStatistics =
      await this._statisticalDataBufferService.postDivisionStatisticNumbers(
        divisions.map((x) => x.Id)
      );
    // console.log("divisionStatistics", divisionStatistics);

    divisionStatistics.sort((a, b) => {
      return b.CurrentGarbageTime - a.CurrentGarbageTime;
    });

    let businessData: GarbageRetentionRankData[] = divisionStatistics.map(
      (statistisc) => {
        let id = statistisc.Id;
        let name = statistisc.Name;

        // let currentGarbageTime = statistisc.CurrentGarbageTime >> 0;
        // let hour = Math.floor(currentGarbageTime / 60);
        // let minute = currentGarbageTime - hour * 60;
        // let time =
        //   hour == 0 ? minute + "分钟" : hour + "小时" + minute + "分钟";
        let time = statistisc.CurrentGarbageTime >> 0;

        let count = statistisc.GarbageDropStationNumber;

        return {
          id,
          name,
          time,
          count,
        } as GarbageRetentionRankData;
      }
    );
    // businessData.length = 2;
    // console.log("businessData", businessData);

    let len = businessData.length;
    if (len < 6) {
      for (let i = 0; i < 6 - len; i++) {
        businessData.push({
          id: "",
          name: "-",
          time: 0,
          count: 0,
        } as GarbageRetentionRankData);
      }
    }
    return businessData;
  }
  /** 行政区 */
  getDataOfCity(divisionId: string) {
    return this.getDataOfCounty(divisionId, DivisionType.County);
  }
}
