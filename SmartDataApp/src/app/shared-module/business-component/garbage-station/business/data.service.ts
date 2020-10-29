import { Injectable } from "@angular/core";
import { GarbageStationRequestService } from "../../../../data-core/repuest/garbage-station.service";
import { DivisionRequestService } from "../../../../data-core/repuest/division.service";
import { GarbageStationTypeRequestService } from "../../../../data-core/repuest/garbage-station.service";
import { Division } from "../../../../data-core/model/waste-regulation/division";
import { GarbageStation } from "../../../../data-core/model/waste-regulation/garbage-station";
import { GarbageStationDao } from "../../../../data-core/dao/garbage-station-dao";
import { DivisionDao } from "../../../../data-core/dao/division-dao";
import { GarbageStationTypeDao } from "../../../../data-core/dao/garbage-station-type-dao";
import { GarbageStationType } from "../../../../data-core/model/waste-regulation/garbage-station-type";
@Injectable()
export class DataService {
    divisions: Division[] = new Array();
    garbageStations: GarbageStation[] = new Array();
    garbageStationTypes:GarbageStationType[]=new Array();
    private  garbageStationDao: GarbageStationDao;
   private divisionDao: DivisionDao;
   private  garbageStationTypeDao:GarbageStationTypeDao;
    constructor(garbageStationService: GarbageStationRequestService
        , divisionService: DivisionRequestService
        , garbageStationTypeService:GarbageStationTypeRequestService) {
        this.garbageStationDao = new GarbageStationDao(garbageStationService);
        this.divisionDao = new DivisionDao(divisionService);
        this.garbageStationTypeDao=new GarbageStationTypeDao(garbageStationTypeService);

    }

  async  requestGarbageStationType(){
        const result = await this.garbageStationTypeDao.garbageStationType();
        return result;
    }

    async requestDivisions() {
        const result = await this.divisionDao.allDivisions();
        return result.Data;
    }

    async requestStations() {
        const result = await this.garbageStationDao.allGarbageStations();
        return result.Data;
    }
}