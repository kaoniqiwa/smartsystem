/**
 * Developer  
 * LastUpdateTime  
 */

import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { IMqttMessage, IMqttServiceOptions, MqttService } from 'ngx-mqtt';
 
export class MqttComponent implements OnDestroy {
    private _subscription: Subscription;
    private MQTT_SERVICE_OPTIONS: IMqttServiceOptions;
    private _mqttService: MqttService; 
    constructor(private host: string, private port: number,username:string,pwd:string) {
        this.MQTT_SERVICE_OPTIONS = {
            hostname: host,
            port: port,
            path: '/mqtt',
            username:username,
            password:pwd
        };
        this._mqttService = new MqttService(this.MQTT_SERVICE_OPTIONS);
        this._mqttService.state.subscribe((x)=>{
             
        });
    }
 

    get connectionState(){
        return this._mqttService.state;
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