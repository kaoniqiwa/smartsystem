
import { BusinessParameter, IEventBusiness,IBusinessData } from "../interface/IBusiness";
import { DatePipe } from "@angular/common";
import {AutoRefreshTimeSpan} from '../interface/IBusiness';
import { EventPushService } from "./mqtt-event/event-push.service";
import { IllegalDropEventRecord } from "../../data-core/model/waste-regulation/illegal-drop-event-record";
export class BaseEventRecord implements IEventBusiness<IBusinessData> {
    events: any[] = []; 
    datePipe: DatePipe;
    villageApiUrl: string;
    dataChanged: (data: IBusinessData) => void;
    timeSpan: AutoRefreshTimeSpan;
    disposing: (self: this) => void;
    eventRules: (event: any) => boolean;
    businessParameter:BusinessParameter;
    constructor(eventService: EventPushService, businessParameter?: BusinessParameter) {
       
        this.businessParameter=businessParameter;
        eventService.pushIllegalDrop.subscribe((event:IllegalDropEventRecord) => {
            this.events.push(event);
            let data = this.getData();
            if (this.dataChanged) this.dataChanged(data);
        });
    } 

    getData(): IBusinessData {
        return null;
    }
}