import { Injectable } from "@angular/core";  
import { RequestService } from "./Request.service";
import { PagedList } from "../model/page";
import { Response } from "../model/Response"; 
import {CameraAIModel} from "../model/camera-ai-model";
import * as url from "../url/ai-models";
import { GetAIModelsParams } from "../model/camera-ai-event-records-params";
@Injectable({
    providedIn:'root'
})
export class AIModelRequestService{
    url: url.AIModel;
    constructor(private requestService: RequestService) {
        this.url = new url.AIModel();
    }
    create(item:CameraAIModel){
        return this.requestService.axios.post<CameraAIModel, Response<CameraAIModel>>(this.url.create(), item);
    }

    get(id: string) {
        return this.requestService.axios.get<Response<CameraAIModel>>(this.url.get(id));
    }

    set(item: CameraAIModel){
        return this.requestService.axios.put<CameraAIModel, Response<CameraAIModel>>(this.url.edit(item.Id),item);
    }

    del(id: string) {
        return this.requestService.axios.delete<Response<CameraAIModel>>(this.url.del(id));
    }

    list(item:GetAIModelsParams){
        return this.requestService.axios.post<GetAIModelsParams, Response<PagedList<CameraAIModel[]>>>(this.url.list(), item);
    }
}
