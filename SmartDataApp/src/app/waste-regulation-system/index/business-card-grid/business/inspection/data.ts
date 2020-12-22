import { IBusinessData } from "../../../../../common/interface/IBusiness"; 
import { GarbageStation } from "../../../../../data-core/model/waste-regulation/garbage-station";
import { IllegalDropEventRecord } from "../../../../../data-core/model/waste-regulation/illegal-drop-event-record";
export class GarbageStationInspection implements IBusinessData {
    todayStationsEvent: IllegalDropEventRecord[];
    garbageStations:GarbageStation[];
    constructor(){
        
    }
}
