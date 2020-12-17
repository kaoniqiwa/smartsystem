import { StatisticalDataBufferService } from '../../buffer/statistical-data-buffer';
import { GarbageStationInspection } from "./data";
import { BusinessParameter } from '../../../../../common/interface/IBusiness';
import { BaseBusinessRefresh } from "../../../../../common/tool/base-business-refresh";
export class GarbageInspection extends BaseBusinessRefresh {

    constructor(dataServe: StatisticalDataBufferService, businessParameter?: BusinessParameter) {
        super(dataServe, businessParameter);
    }

    async getData() {
        const divisionsId = this.businessParameter.map.get('divisionsId')
            , model = new GarbageStationInspection()
            , statisticNumber = await (this.dataServe as StatisticalDataBufferService).getDivisionStatisticNumber(divisionsId)
            , garbageStations = await (this.dataServe as StatisticalDataBufferService).getGarbageStations(divisionsId);
        model.garbageStations = garbageStations;
        model.todayEventNumbers = statisticNumber.TodayEventNumbers;
        return model;
    }
}