import { Injectable } from "@angular/core";
import { DivisionType } from "src/app/data-core/model/enum";
import { GlobalStoreService } from "src/app/shared-module/global-store.service";
import { StatisticalDataBufferService } from "src/app/waste-regulation-system/index/business-card-grid/buffer/statistical-data-buffer";
import { GarbageRetentionRankData } from "../garbage-retention-rank.model";

@Injectable()
export class GarbageRetentionRankService {
  constructor(
    private _statisticalDataBufferService: StatisticalDataBufferService
  ) {}

  async loadData(
    divisionId: string,
    divisionType: DivisionType
  ): Promise<GarbageRetentionRankData[]> {
    switch (divisionType) {
      case DivisionType.Committees:
        return this.getDataOfCommittees(divisionId);
      case DivisionType.County:
        return await this.getDataOfCounty(divisionId);
      case DivisionType.City:
        return await this.getDataOfCity(divisionId);
      default:
        throw Error();
    }
  }

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
        //   hour == 0 ? minute + Language.json.Time.minute : hour + Language.json.Time.hour + minute + Language.json.Time.minute;
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

  /**
   * 拉取居委会下的所有厢房统计信息
   */
  async getDataOfCommittees(divisionId: string) {
    // 当前居委会下的所有厢房统计信息
    let garbageStationsStatistics =
      await this._statisticalDataBufferService.postGarbageStationStatisticNumbers(
        divisionId
      );
    // console.log("垃圾厢房", garbageStationsStatistics);

    garbageStationsStatistics.sort((a, b) => {
      return b.CurrentGarbageTime - a.CurrentGarbageTime;
    });
    let businessData: GarbageRetentionRankData[] =
      garbageStationsStatistics.map((statistisc) => {
        let id = statistisc.Id;
        let name = statistisc.Name;

        // let currentGarbageTime = statistisc.CurrentGarbageTime >> 0;
        // let hour = Math.floor(currentGarbageTime / 60);
        // let minute = currentGarbageTime - hour * 60;
        // let time =
        //   hour == 0 ? minute + Language.json.Time.minute : hour + Language.json.Time.hour + minute + Language.json.Time.minute;
        let time = statistisc.CurrentGarbageTime >> 0;

        let count = statistisc.MaxGarbageCount;

        return {
          id,
          name,
          time,
          count,
        } as GarbageRetentionRankData;
      });

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
}
