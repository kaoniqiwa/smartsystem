import { Injectable } from "@angular/core";  
import { RequestService } from "./Request.service";
import { PagedList } from "../model/page";
import { Response } from "../model/Response";   
import * as url from "../url/event";
import { GetCameraAIEventRecordsParams } from "../model/aiop/camera-ai-event-records-params";
import { CameraAIEventRecord } from "../model/aiop/camera-ai-event-record";
@Injectable({
    providedIn:'root'
})
export class MapRequestService{
    url: url.EventRecord;
    constructor(private requestService: RequestService) {
        this.url = new url.EventRecord();
    }
    
 
    list(item:GetCameraAIEventRecordsParams){
        return this.requestService.axios.post<GetCameraAIEventRecordsParams, Response<PagedList<CameraAIEventRecord>>>(this.url.list(), item);
    }
}