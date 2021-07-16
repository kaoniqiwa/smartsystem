import { Injectable } from "@angular/core";
import { RequestService } from "./request.service";
import { PagedList } from "../model/page";
import { HowellResponse } from "../model/response";
import { CameraAIModel } from "../model/aiop/camera-ai-model";
import * as url from "../url/aiop/ai-models";
import { GetAIModelsParams } from "../model/aiop/camera-ai-event-records-params";
import { HowellAuthHttpService } from "./howell-auth-http.service";
import { SaveModel } from "../model/save-model";
@Injectable({
  providedIn: "root",
})
export class AIModelRequestService {
  url: url.AIModel;
  constructor(private requestService: HowellAuthHttpService) {
    this.url = new url.AIModel();
  }
  create(item: CameraAIModel) {
    return this.requestService.post<
      CameraAIModel,
      HowellResponse<CameraAIModel>
    >(this.url.create(), item);
  }

  get(id: string) {
    return this.requestService.get<CameraAIModel>(this.url.get(id));
  }

  set(item: CameraAIModel) {
    return this.requestService.put<
      CameraAIModel,
      HowellResponse<CameraAIModel>
    >(
      this.url.edit(item.Id),
      SaveModel.toModel(item, SaveModel.formMustField.division)
    );
  }

  del(id: string) {
    return this.requestService.delete<CameraAIModel>(this.url.del(id));
  }

  list(item: GetAIModelsParams) {
    return this.requestService.post<
      GetAIModelsParams,
      HowellResponse<PagedList<CameraAIModel>>
    >(this.url.list(), item);
  }

  parse(base64JSONData: string) {
    return this.requestService.postString<any, HowellResponse<CameraAIModel>>(
      this.url.parse(),
      base64JSONData
    );
  }
}
