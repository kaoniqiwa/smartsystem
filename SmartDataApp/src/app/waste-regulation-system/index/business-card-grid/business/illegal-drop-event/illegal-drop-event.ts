import { BaseEventRecord } from "../../../../../common/tool/base-event-record";

import { IllegalDropEventRecord } from "../../../../../data-core/model/waste-regulation/illegal-drop-event-record";
import { EventPushService } from "../../../../../common/tool/mqtt-event/event-push.service";
import { BusinessParameter } from '../../../../../common//interface/IBusiness';
import { IllegalDropEventInfo  } from "./data";
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
            const item = events.pop() as IllegalDropEventRecord
            ,info = new IllegalDropEventInfo();
            
            info.EventType = item.EventType;
            info.EventTime= datePipe.transform(item.EventTime,'MM-dd HH:mm:ss');
            info.DivisionName=item.Data.DivisionName;
            info.StationName=item.Data.StationName;
            info.ImageUrl=item.ImageUrl;
            info.RecordUrl=item.RecordUrl;
            events.push(item);
            this.eventsMap.set(this.IllegalDrop,events); 
            return info;

        }
    }
}