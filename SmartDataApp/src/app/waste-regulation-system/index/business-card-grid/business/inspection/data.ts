import { IBusinessData } from "../../../../../common/interface/IBusiness";
import { EventNumber } from "../../../../../data-core/model/waste-regulation/event-number";
import { GarbageStation } from "../../../../../data-core/model/waste-regulation/garbage-station";
export class GarbageStationInspection implements IBusinessData {
    todayEventNumbers: EventNumber[];
    garbageStations:GarbageStation[];
    constructor(){
        
    }
}
