
import { Injectable } from "@angular/core";
import { GarbageStationRequestService } from "../../../../data-core/repuest/garbage-station.service";
import { GarbageStation, GetGarbageStationsParams } from "../../../../data-core/model/waste-regulation/garbage-station";
@Injectable()
export class DataService {

    constructor(private garbageStationService: GarbageStationRequestService) {

    }
    async addGarbageStation(item: GarbageStation) {
        const result = await this.garbageStationService.create(item).toPromise();
        return result;
    }

    async delGarbageStation(stationId: string) {
        const result = await this.garbageStationService.del(stationId).toPromise();
        return result.FaultCode == 0;
    }

    async editGarbageStation(item: GarbageStation){
        const result =  this.garbageStationService.set(item).toPromise();
        return result; 
    }
}