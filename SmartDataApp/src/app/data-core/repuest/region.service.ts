import { Injectable } from "@angular/core";
import { SaveModel } from "../model/save-model";
import { Region, GetRegionsParams } from "../model/aiop/region";
import { AIOPRegionUrl, AIOPRegionsResourcesUrl } from "../url/aiop/region";
import { PagedList } from "../model/page";
import { HowellResponse } from "../model/response";
import { BatchRequest, BatchResult, SingleResult } from "../model/batch";
import { Resource } from "../model/aiop/resource";
import { HowellAuthHttpService } from "./howell-auth-http.service";
@Injectable({
  providedIn: "root",
})
export class RegionRequestService {
  constructor(private requestService: HowellAuthHttpService) {}
  create(item: Region) {
    return this.requestService.post<Region, HowellResponse<Region>>(
      AIOPRegionUrl.create(),
      SaveModel.toModel(item, SaveModel.formMustField.region)
    );
  }

  get(id: string) {
    return this.requestService.get<Region>(AIOPRegionUrl.get(id));
  }

  set(item: Region) {
    return this.requestService.put<Region, HowellResponse<Region>>(
      AIOPRegionUrl.edit(item.Id),
      SaveModel.toModel(item, SaveModel.formMustField.region)
    );
  }

  del(id: string) {
    return this.requestService.delete<Region>(AIOPRegionUrl.del(id));
  }

  list(item: GetRegionsParams) {
    return this.requestService.post<
      GetRegionsParams,
      HowellResponse<PagedList<Region>>
    >(AIOPRegionUrl.list(), item);
  }
}

@Injectable({
  providedIn: "root",
})
export class RegionResourceRequestService {
  constructor(private requestService: HowellAuthHttpService) {}
  batch(regionId: string, item: BatchRequest) {
    return this.requestService.post<BatchRequest, BatchResult>(
      AIOPRegionsResourcesUrl.batch(regionId),
      item
    );
  }

  create(regionId: string, resourceId: string) {
    return this.requestService.post<null, Resource>(
      AIOPRegionsResourcesUrl.create(regionId, resourceId)
    );
  }

  get(regionId: string, resourceId: string) {
    return this.requestService.get<Resource>(
      AIOPRegionsResourcesUrl.get(regionId, resourceId)
    );
  }

  del(regionId: string, resourceId: string) {
    return this.requestService.delete<Resource>(
      AIOPRegionsResourcesUrl.del(regionId, resourceId)
    );
  }
}
