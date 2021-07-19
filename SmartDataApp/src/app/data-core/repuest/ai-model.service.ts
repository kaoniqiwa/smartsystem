import { Injectable } from "@angular/core";
import { RequestService } from "./request.service";
import { PagedList } from "../model/page";
import { HowellResponse } from "../model/response";
import { CameraAIModel } from "../model/aiop/camera-ai-model";
import { AIOPAIModelUrl } from "../url/aiop/ai-models";
import { GetAIModelsParams } from "../model/aiop/camera-ai-event-records-params";
import { HowellAuthHttpService } from "./howell-auth-http.service";
import { SaveModel } from "../model/save-model";
@Injectable({
  providedIn: "root",
})
export class AIModelRequestService {
  constructor(private requestService: HowellAuthHttpService) {}
  create(item: CameraAIModel) {
    return this.requestService.post<
      CameraAIModel,
      HowellResponse<CameraAIModel>
    >(AIOPAIModelUrl.create(), item);
  }

  get(id: string) {
    return this.requestService.get<CameraAIModel>(AIOPAIModelUrl.get(id));
  }

  set(item: CameraAIModel) {
    return this.requestService.put<
      CameraAIModel,
      HowellResponse<CameraAIModel>
    >(
      AIOPAIModelUrl.edit(item.Id),
      SaveModel.toModel(item, SaveModel.formMustField.division)
    );
  }

  del(id: string) {
    return this.requestService.delete<CameraAIModel>(AIOPAIModelUrl.del(id));
  }

  list(item: GetAIModelsParams) {
    return this.requestService.post<
      GetAIModelsParams,
      HowellResponse<PagedList<CameraAIModel>>
    >(AIOPAIModelUrl.list(), item);
  }

  parse(base64JSONData: string) {
    return this.requestService.postString<any, HowellResponse<CameraAIModel>>(
      AIOPAIModelUrl.parse(),
      base64JSONData
    );
  }
}
