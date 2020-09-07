import { Injectable } from "@angular/core";
import { RequestService } from "./Request.service";
import { PagedList } from "../model/page";
import { Response } from "../model/Response";
import { CameraAIModel } from "../model/aiop/camera-ai-model";
import * as url from "../url/aiop/ai-models"; 
import { GetAIModelsParams } from "../model/aiop/camera-ai-event-records-params";
import { HowellAuthHttpService } from "./howell-auth-http.service";
@Injectable({
    providedIn: 'root'
})
export class AIModelRequestService {
    url: url.AIModel;
    constructor(private requestService: HowellAuthHttpService) {
        this.url = new url.AIModel();
    }
    create(item: CameraAIModel) {
        return this.requestService.post<CameraAIModel, Response<CameraAIModel>>(this.url.create(), item);
    }

    get(id: string) {
        return this.requestService.get<CameraAIModel>(this.url.get(id));
    }

    set(item: CameraAIModel) {
        return this.requestService.put<CameraAIModel, Response<CameraAIModel>>(this.url.edit(item.Id), item);
    }

    del(id: string) {
        return this.requestService.delete<CameraAIModel>(this.url.del(id));
    }

    list(item: GetAIModelsParams) {
        return this.requestService.post<GetAIModelsParams, Response<PagedList<CameraAIModel>>>(this.url.list(), item);
    }

    parse(base64JSONData: string) {
        return this.requestService.postString<any, Response<CameraAIModel>>(this.url.parse(), base64JSONData);
    }
}
