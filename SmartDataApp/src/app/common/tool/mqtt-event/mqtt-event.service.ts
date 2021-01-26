import { Injectable } from "@angular/core";
import { MqttComponent, } from "./mqtt";
import { MqttConnectionState } from 'ngx-mqtt';
import { EventPushService } from "./event-push.service";
import { IllegalDropEventRecord } from "../../../data-core/model/waste-regulation/illegal-drop-event-record";
import { ConfigRequestService } from "../../../data-core/repuest/config.service";
@Injectable({
    providedIn: 'root'
})
export class MQTTEventService {
    mqtt: MqttComponent;
    constructor(private pushService: EventPushService, private configService: ConfigRequestService) {
        // this.mqtt = new MqttComponent('192.168.21.241', 15883);
        configService.getMQTT().subscribe(x =>
            this.mqtt = new MqttComponent(document.location.hostname, x.Port));
    }

    listenerIllegalDrop(divisionsId?: string) {
        var topic = 'AIOP/Garbage/Counties/';
        topic += (divisionsId ? divisionsId : '+') + '/Committees/+/GarbageStations/+/Events/1';
       
        // console.log(topic);
        setTimeout(() => {
            this.mqtt.subscription(topic, (topic: string, message: string) => {

                const msg = JSON.parse(message) as IllegalDropEventRecord;
                //console.log(msg);
                this.pushService.pushIllegalDrop.emit(msg);
            });
            this.mqtt.connectionState.subscribe((x) => {
                const state = x != MqttConnectionState.CLOSED;
                this.pushService.connectionState.emit(state);
            });
        }, 500); 
        
    }

    unlistenerIllegalDrop(){
        this.mqtt.ngOnDestroy();
    }
}
