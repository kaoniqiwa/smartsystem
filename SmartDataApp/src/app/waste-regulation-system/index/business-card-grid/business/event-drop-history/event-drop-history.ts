import {
  StatisticalDataBufferService,
  TimeUnitEnum,
} from "../../buffer/statistical-data-buffer";
import { DropEvent } from "./data";
import { BusinessParameter } from "../../../../../common/interface/IBusiness";
import { BaseBusinessRefresh } from "../../../../../common/tool/base-business-refresh";
import { EventType } from "src/app/data-core/model/waste-regulation/event-number";
export class EventDropHistory extends BaseBusinessRefresh {
  constructor(
    dataServe: StatisticalDataBufferService,
    businessParameter?: BusinessParameter
  ) {
    super(dataServe, businessParameter);
  }

  async getData() {
    const divisionId = this.businessParameter.map.get("divisionId"),
      eventType = this.businessParameter.map.get("eventType") as EventType;
    let model = new DropEvent();
    model.datas = new Array();

    let data = await (
      this.dataServe as StatisticalDataBufferService
    ).getDivisionEventNumbers(divisionId, TimeUnitEnum.Hour);

    for (var x of data) {
      for (const y of x.EventNumbers)
        if (y.EventType == EventType.MixedInto) model.datas.push(y);
    }
    return model;
  }
}

// export class EventDropHistoryB extends EventDropHistory{

// }
