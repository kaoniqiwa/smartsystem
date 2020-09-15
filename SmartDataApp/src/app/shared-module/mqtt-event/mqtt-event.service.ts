import { EventEmitter, inject, Injectable } from "@angular/core"; 
import { MqttComponent } from "./mqtt";
import { EventPushService  } from "./event-push.service";
import { IllegalDropEventRecord } from "../../data-core/model/waste-regulation/illegal-drop-event-record";
@Injectable({
    providedIn: 'root'
})
export class MQTTEventService {
    mqtt: MqttComponent;
    constructor(private pushService:EventPushService) {
        this.mqtt = new MqttComponent('192.168.21.241', 15883);
    }

    listenerIllegalDrop(divisionsId?: string, garbageStationId?: string) {
        var topic = 'AIOP/Garbage/Divisions/';
        topic += (divisionsId ? divisionsId : '+') + '/GarbageStations/';
        topic += (garbageStationId ? garbageStationId : '+') + '/Events/1';
        this.mqtt.subscription(topic,(topic:IllegalDropEventRecord, message)=>{
            this.pushService.pushIllegalDrop.emit(topic);
        })
    }
}
