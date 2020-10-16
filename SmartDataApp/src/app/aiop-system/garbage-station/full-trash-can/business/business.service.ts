import { Injectable } from "@angular/core";
import { GarbageStationRequestService } from "../../../../data-core/repuest/garbage-station.service";
import { GetGarbageStationStatisticNumbersParams,GarbageStationNumberStatistic }
    from "../../../../data-core/model/waste-regulation/garbage-station-number-statistic";
import { ListAttribute } from "../../../../common/tool/table-form-helper";
@Injectable()
export class DataService {
    statistics:GarbageStationNumberStatistic[]=new Array();
    constructor(private garbageStationService: GarbageStationRequestService) {

    }

    async stationStatistic() {
        const param = new GetGarbageStationStatisticNumbersParams();
        param.PageIndex = 1;
        param.PageSize = new ListAttribute().maxSize;
        const result = await this.garbageStationService.statisticNumberList(param).toPromise();
        return result.Data.Data
    }
}