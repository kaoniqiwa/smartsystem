import { Injectable } from "@angular/core";
import { GarbageStationRequestService } from "../../../../data-core/repuest/garbage-station.service";
import { GarbageStationNumberStatistic }
    from "../../../../data-core/model/waste-regulation/garbage-station-number-statistic";
import {GarbageStation  } from "../../../../data-core/model/waste-regulation/garbage-station";
import { GarbageStationDao } from "../../../../data-core/dao/garbage-station-dao";
@Injectable()
export class DataService {
    statistics:GarbageStationNumberStatistic[]=new Array();
    garbageStations:GarbageStation[]=new Array();
    garbageStationDao:GarbageStationDao;
    constructor(garbageStationService: GarbageStationRequestService) {
      this.garbageStationDao = new GarbageStationDao(garbageStationService);
    }

    async stationStatistic() {
        const result =await this.garbageStationDao.allGarbageStationsStatistic();
        return result.Data;
    }

   async requestStations(){
        const result = await  this.garbageStationDao.allGarbageStations();
        return result.Data;
    }
}