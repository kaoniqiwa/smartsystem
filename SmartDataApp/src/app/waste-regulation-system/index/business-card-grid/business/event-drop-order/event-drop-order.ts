import { StatisticalDataBufferService } from "../../buffer/statistical-data-buffer";
import { EventDropInfo, EventDropOrderInfo } from "./data";
import { BusinessParameter } from "../../../../../common/interface/IBusiness";
import { BaseBusinessRefresh } from "../../../../../common/tool/base-business-refresh";

import { DivisionType, EventType } from "../../../../../data-core/model/enum";

/**
 * 今日 事件排行
 */
export class EventDropOrder extends BaseBusinessRefresh {
  constructor(
    dataServe: StatisticalDataBufferService,
    businessParameter?: BusinessParameter
  ) {
    super(dataServe, businessParameter);
  }

  async getData() {
    debugger;
    const model = new EventDropOrderInfo(),
      divisionDrop = new Map<
        DivisionType,
        Array<{ id: string; name: string }>
      >();
    divisionDrop.set(DivisionType.City, [
      {
        id: DivisionType.County + "",
        name: "街道",
      },
      {
        id: DivisionType.Committees + "",
        name: "居委",
      },
    ]);
    divisionDrop.set(DivisionType.County, [
      {
        id: DivisionType.Committees + "",
        name: "居委",
      },
      {
        id: "station",
        name: "投放点",
      },
    ]);
    model.items = new Array();
    const divisionId = this.businessParameter.divisionId as string; //父区划
    const divisionType = this.businessParameter.divisionType as DivisionType;
    const eventType = this.businessParameter.eventType as EventType;
    const dropList = this.businessParameter.dropList as string;
    const division = await (
      this.dataServe as StatisticalDataBufferService
    ).getAncestorDivisions(divisionId);
    const fillIllegalDropInfo = async () => {
      const ancestorDivisions = await (
          this.dataServe as StatisticalDataBufferService
        ).getAncestorDivisions(divisionId),
        ids = new Array<string>();

      switch (dropList) {
        case DivisionType.County + "":
          ancestorDivisions
            .filter((f) => f.DivisionType == DivisionType.County)
            .map((d) => ids.push(d.Id));
          break;

        case DivisionType.Committees + "":
          ancestorDivisions
            .filter((f) => f.DivisionType == DivisionType.Committees)
            .map((d) => ids.push(d.Id));
          break;
        default:
          ancestorDivisions
            .filter((f) => f.ParentId == divisionId)
            .map((d) => ids.push(d.Id));
          break;
      }

      const data = await (
        this.dataServe as StatisticalDataBufferService
      ).postDivisionStatisticNumbers(ids);
      for (const x of data) {
        const info = new EventDropInfo();
        model.items.push(info);
        info.division = x.Name;
        info.dropNum = 0;
        info.id = x.Id;
        for (const v of x.TodayEventNumbers)
          if (v.EventType == eventType) info.dropNum += v.DayNumber;
      }
    };
    const stationDropInfo = async () => {
      const stations = await (
          this.dataServe as StatisticalDataBufferService
        ).getGarbageStations(divisionId),
        stationIds = new Array<string>();

      for (const x of stations) stationIds.push(x.Id);
      if (stationIds.length) {
        const data = await (
          this.dataServe as StatisticalDataBufferService
        ).postGarbageStationStatisticNumbers(stationIds);
        // console.log(data,stationIds);
        for (const x of data) {
          const info = new EventDropInfo();
          model.items.push(info);
          info.division = x.Name;
          info.dropNum = 0;
          info.id = x.Id;
          if (x.TodayEventNumbers)
            for (const v of x.TodayEventNumbers)
              if (v.EventType == eventType) info.dropNum += v.DayNumber;
        }
      }
    };

    model.eventType = eventType;

    if (dropList) {
      model.dropList = divisionDrop.get(division[0].DivisionType);
      //统计街道 乱扔垃圾
      if (dropList == "station") await stationDropInfo();
      else await fillIllegalDropInfo();
      model.defaultId = dropList;
    } else {
      model.dropList = divisionDrop.get(division[0].DivisionType);

      if (divisionType == DivisionType.City) {
        model.defaultId = DivisionType.County + "";
        //统计街道 统计居委 乱扔垃圾
        await fillIllegalDropInfo();
      } else if (divisionType == DivisionType.County) {
        model.defaultId = DivisionType.Committees + "";
        //统计居委 乱扔垃圾
        await fillIllegalDropInfo();
      } else if (divisionType == DivisionType.Committees) {
        //统计投放点 乱扔垃圾
        await stationDropInfo();
      }
    }
    return model;
  }
}

export class EventDropOrderB extends EventDropOrder {}
