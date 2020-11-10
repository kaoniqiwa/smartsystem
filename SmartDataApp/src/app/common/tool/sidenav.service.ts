import { Injectable,EventEmitter } from "@angular/core";
import { SystemModeEnum } from "./table-form-helper";
@Injectable({
    providedIn:'root'
})
export class SideNavService{
    
    playVideoBug:EventEmitter<boolean>;
    systemMode_:SystemModeEnum;
    constructor(){
        this.playVideoBug = new EventEmitter<boolean>();
    }

    set systemMode(systemMode:SystemModeEnum){     
        sessionStorage.setItem('SystemMode',systemMode+'');
    }

    get systemMode(){
        return  Number.parseInt(sessionStorage.getItem('SystemMode'));
    }
}