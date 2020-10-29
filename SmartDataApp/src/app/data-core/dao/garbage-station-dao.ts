import { GetGarbageStationsParams } from "../model/waste-regulation/garbage-station";
import { GarbageStationRequestService } from "../repuest/garbage-station.service";
import { ListAttribute } from "../../common/tool/table-form-helper";
import { GetGarbageStationStatisticNumbersParams } from "../model/waste-regulation/garbage-station-number-statistic";
export class GarbageStationDao extends ListAttribute {
    constructor(private requestService: GarbageStationRequestService) {
        super();

    }

    async allGarbageStations() {
        const param = new GetGarbageStationsParams();
        param.PageIndex = 1;
        param.PageSize = this.maxSize;
        const result = await this.requestService.list(param).toPromise();
        return result.Data;
    }

    
    async allGarbageStationsStatistic() {
        const param = new GetGarbageStationStatisticNumbersParams();
        param.PageIndex = 1;
        param.PageSize =  this.maxSize;
        const result = await this.requestService.statisticNumberList(param).toPromise();
        return result.Data;
    }
}