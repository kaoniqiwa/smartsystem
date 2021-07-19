import { AIOPPlatformUrl } from "../url/aiop/platforms";
import { HowellResponse } from "../model/response";
import { Platform as PlatformModel, Platform } from "../model/aiop/platform";
import { Injectable } from "@angular/core";
import { GetPlatformsParams } from "../model/aiop/platforms-params";
import { PagedList } from "../model/page";
import { Protocol } from "../model/aiop/protocol";
import { HowellAuthHttpService } from "./howell-auth-http.service";
import { SaveModel } from "../model/save-model";

@Injectable({
  providedIn: "root",
})
export class PlatformRequestSerivce {
  constructor(private requestService: HowellAuthHttpService) {}

  create(item: PlatformModel) {
    return this.requestService.post<
      PlatformModel,
      HowellResponse<PlatformModel>
    >(
      AIOPPlatformUrl.create(),
      SaveModel.toModel(item, SaveModel.formMustField.platform)
    );
  }

  get(id: string) {
    return this.requestService.get<PlatformModel>(AIOPPlatformUrl.get(id));
  }

  set(item: PlatformModel) {
    return this.requestService.put<
      PlatformModel,
      HowellResponse<PlatformModel>
    >(AIOPPlatformUrl.edit(item.Id), item);
  }

  del(id: string) {
    return this.requestService.delete<PlatformModel>(AIOPPlatformUrl.del(id));
  }

  list(item: GetPlatformsParams) {
    return this.requestService.post<
      GetPlatformsParams,
      HowellResponse<PagedList<Platform>>
    >(AIOPPlatformUrl.list(), item);
  }

  protocol() {
    return this.requestService.get<Protocol[]>(AIOPPlatformUrl.protocols());
  }

  sync(id: string) {
    return this.requestService.post<any>(AIOPPlatformUrl.sync(id));
  }
}
