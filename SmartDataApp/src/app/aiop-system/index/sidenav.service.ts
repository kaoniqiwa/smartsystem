import { Injectable,EventEmitter } from "@angular/core";

@Injectable({
    providedIn:'root'
})
export class SideNavService{
    
    playVideoBug:EventEmitter<boolean>;
    constructor(){
        this.playVideoBug = new EventEmitter<boolean>();
    }
}