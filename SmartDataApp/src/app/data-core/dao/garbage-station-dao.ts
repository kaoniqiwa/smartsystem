import { GarbageStation, GetGarbageStationsParams } from "../model/waste-regulation/garbage-station";
import { GarbageStationRequestService } from "../repuest/garbage-station.service";
import { ListAttribute } from "../../common/tool/table-form-helper";
import { GetGarbageStationStatisticNumbersParams } from "../model/waste-regulation/garbage-station-number-statistic";
import { AppCaChe } from "../../common/tool/app-cache/app-cache";
export class GarbageStationDao extends ListAttribute {

    cache = new AppCaChe(60*30 * 1000);
    readonly garbageStation = 'GarbageStation';
    constructor(private requestService: GarbageStationRequestService) {
        super();

    }

    async allGarbageStations() {
        var result = this.cache.get<GarbageStation[]>(this.garbageStation);
        if (!result) {
            const param = new GetGarbageStationsParams();
            param.PageIndex = 1;
            param.PageSize = this.maxSize;
            const response = await this.requestService.list(param).toPromise();
            this.cache.set(this.garbageStation, response.Data.Data);
            result= response.Data.Data;
        }       
        return result;
    }
    
    async allGarbageStationsStatistic() {
        const param = new GetGarbageStationStatisticNumbersParams();
        param.PageIndex = 1;
        param.PageSize =  this.maxSize;
        const result = await this.requestService.statisticNumberList(param).toPromise();
        return result.Data;
    }
}