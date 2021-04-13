import { Injectable } from "@angular/core";   
import { PagedList } from "../model/page";
import { Response } from "../model/Response";   
import * as url from "../url/waste-regulation/event";
import { GetGarbageDropEventRecordsParams ,GarbageDropEventRecord} from "../model/waste-regulation/garbage-drop-event-record"; 
import { HowellAuthHttpService } from "./howell-auth-http.service";
@Injectable({
    providedIn:'root'
})
export class EventRequestService{
    url: url.EventRecord;
    constructor(private requestService: HowellAuthHttpService) {      
        this.url = new url.EventRecord();
    }    
 
    list(item:GetGarbageDropEventRecordsParams){
        return this.requestService.post<GetGarbageDropEventRecordsParams, Response<PagedList<GarbageDropEventRecord>>>(this.url.garbageDropList(), item);
    }
}