/**
 * Developer  
 * LastUpdateTime  
 */

import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { IMqttMessage, IMqttServiceOptions, MqttService ,MqttConnectionState} from 'ngx-mqtt';
 
export class MqttComponent implements OnDestroy {
    private _subscription: Subscription;
    private MQTT_SERVICE_OPTIONS: IMqttServiceOptions;
    private _mqttService: MqttService;
    private _connectionState =false;
    constructor(private host: string, private port: number) {
        this.MQTT_SERVICE_OPTIONS = {
            hostname: host,
            port: port,
            path: '/mqtt'
        };
        this._mqttService = new MqttService(this.MQTT_SERVICE_OPTIONS);
        this._mqttService.state.subscribe((x)=>{
            this._connectionState = x != MqttConnectionState.CLOSED ; 
        });
    }
 

    get connectionState(){
        return this._connectionState;
    }
    public subscription(topic: string, fn?: Function) {
        this._subscription = this._mqttService.observe(topic).subscribe((message: IMqttMessage) => {
            if (fn) {
                fn(message.topic, message.payload.toString());
            }
        });
    }

    public unsafePublish(topic: string, message: string): void {
        this._mqttService.unsafePublish(topic, message, { qos: 1, retain: true });
    }

    public ngOnDestroy() {
        this._subscription.unsubscribe();
    }
}