import { Injectable,EventEmitter } from "@angular/core";
import { SystemModeEnum } from "./table-form-helper";
@Injectable({
    providedIn:'root'
})
export class SideNavService{
    
    playVideoBug:EventEmitter<boolean>;
    systemMode:SystemModeEnum;
    constructor(){
        this.playVideoBug = new EventEmitter<boolean>();
    }
}