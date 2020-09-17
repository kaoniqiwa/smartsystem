import { BaseEventRecord } from "../../../../../common/tool/base-event-record";

import { IllegalDropEventRecord } from "../../../../../data-core/model/waste-regulation/illegal-drop-event-record";
import { EventPushService } from "../../../../../common/tool/mqtt-event/event-push.service";
import { BusinessParameter } from '../../../../../common//interface/IBusiness';
import { IllegalDropEventInfo, IllegalDropEventInfos  } from "./data";
import { DatePipe } from "@angular/common";

export class IllegalDropEvent extends BaseEventRecord {

    constructor(eventService: EventPushService, businessParameter?: BusinessParameter) {
        super(eventService, businessParameter);

    }

    getData() {
        const events= this.eventsMap.get(this.IllegalDrop)
        ,datePipe=this.businessParameter.map.get('datePipe') as DatePipe;
        if (events.length == 0) return null;
        else {
            const items = events.reverse().slice(0, 3)as IllegalDropEventRecord[]
            ,infos = new IllegalDropEventInfos();
            infos.items = new Array();
            for(const  x of items){
                const info = new IllegalDropEventInfo();
            
                info.EventType = x.EventType;
                info.EventTime= datePipe.transform(x.EventTime,'MM-dd HH:mm:ss');
                info.DivisionName=x.Data.DivisionName;
                info.StationName=x.Data.StationName;
                info.ImageUrl=x.ImageUrl;
                info.RecordUrl=x.RecordUrl;
                infos.items.push(info);
            }                     
            return infos;
        }
    }
}