
import { BusinessParameter, IEventBusiness, IBusinessData } from "../interface/IBusiness";
import { DatePipe } from "@angular/common";
import { AutoRefreshTimeSpan } from '../interface/IBusiness';
import { EventPushService } from "./mqtt-event/event-push.service";
import { IllegalDropEventRecord } from "../../data-core/model/waste-regulation/illegal-drop-event-record";
import { EventRecord } from "../../data-core/model/waste-regulation/event-record";
export class BaseEventRecord implements IEventBusiness<IBusinessData> {
    eventsMap = new Map<string, EventRecord[]>();
    datePipe: DatePipe;
    villageApiUrl: string;
    dataChanged: (data: IBusinessData) => void;
    timeSpan: AutoRefreshTimeSpan;
    disposing: (self: this) => void;
    eventRules: (event: any) => boolean;
    businessParameter: BusinessParameter;
    readonly IllegalDrop = 'IllegalDrop';
    constructor(eventService: EventPushService, businessParameter?: BusinessParameter) {
        this.eventsMap.set(this.IllegalDrop, [null, null, null]);
        this.businessParameter = businessParameter;
        eventService.pushIllegalDrop.subscribe((event: IllegalDropEventRecord) => {

            var dropMap = this.eventsMap.get(this.IllegalDrop),
            dataChange = (index:number)=>{
                dropMap[index] = event;
                setTimeout(() => {
                    let data = this.getData();
                    if (this.dataChanged) this.dataChanged(data);
                    dropMap[2] = null; 
                    this.eventsMap.set(this.IllegalDrop, dropMap);
                }, 1000 * 5);
            };
            if (dropMap[0] == null) {
                dropMap[0] = event;
                let data = this.getData();
                if (this.dataChanged) this.dataChanged(data);
            }
            else if (dropMap[1] == null) {
                dataChange(1);
            }
            else if (dropMap[2] == null) {
                dataChange(2);
            }
            else if (dropMap[0] && dropMap[1] && dropMap[2]) {
                dropMap[0] = event;
                dropMap[1] = null;
                dropMap[2] = null;
                let data = this.getData();
                if (this.dataChanged) this.dataChanged(data);
            }
          
            this.eventsMap.set(this.IllegalDrop, dropMap); 
              
        });
    }

    getData(): IBusinessData {
        return null;
    }
}