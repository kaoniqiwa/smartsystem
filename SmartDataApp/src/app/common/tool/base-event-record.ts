
import { BusinessParameter, IEventBusiness,IBusinessData } from "../interface/IBusiness";
import { DatePipe } from "@angular/common";
import {AutoRefreshTimeSpan} from '../interface/IBusiness';
import { EventPushService } from "./mqtt-event/event-push.service";
import { IllegalDropEventRecord } from "../../data-core/model/waste-regulation/illegal-drop-event-record";
import { EventRecord } from "../../data-core/model/waste-regulation/event-record";
export class BaseEventRecord implements IEventBusiness<IBusinessData> {
    eventsMap = new Map<string,EventRecord[]>();
    datePipe: DatePipe;
    villageApiUrl: string;
    dataChanged: (data: IBusinessData) => void;
    timeSpan: AutoRefreshTimeSpan;
    disposing: (self: this) => void;
    eventRules: (event: any) => boolean;
    businessParameter:BusinessParameter;
    readonly IllegalDrop = 'IllegalDrop';
    constructor(eventService: EventPushService, businessParameter?: BusinessParameter) {
        this.eventsMap.set(this.IllegalDrop,new Array());
        this.businessParameter=businessParameter;
        eventService.pushIllegalDrop.subscribe((event:IllegalDropEventRecord) => {
           
            const dropMap=this.eventsMap.get(this.IllegalDrop);
            dropMap.push(event);
            this.eventsMap.set(this.IllegalDrop,dropMap);
            let data = this.getData();
            if (this.dataChanged) this.dataChanged(data);
        });
    } 

    getData(): IBusinessData {
        return null;
    }
}