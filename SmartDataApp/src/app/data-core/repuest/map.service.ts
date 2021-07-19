import { Injectable } from "@angular/core";
import { RequestService } from "./request.service";
import { PagedList } from "../model/page";
import { HowellResponse } from "../model/response";
import { AIOPGisMapUrl, AIOPGisMapElementResourceUrl } from "../url/aiop/maps";
import { Map as GisMap } from "../model/aiop/map";
import { GetMapElementsParams } from "../model/aiop/map-elements-params";
import { Resource } from "../model/aiop/resource";
import { HowellAuthHttpService } from "./howell-auth-http.service";
@Injectable({
  providedIn: "root",
})
export class MapRequestService {
  constructor(private requestService: RequestService) {}
  create(item: GisMap) {
    return this.requestService.axios.post<GisMap, HowellResponse<GisMap>>(
      AIOPGisMapUrl.create(),
      item
    );
  }

  get(id: string) {
    return this.requestService.axios.get<HowellResponse<GisMap>>(
      AIOPGisMapUrl.get(id)
    );
  }

  set(item: GisMap) {
    return this.requestService.axios.put<GisMap, HowellResponse<GisMap>>(
      AIOPGisMapUrl.edit(item.Id),
      item
    );
  }

  del(id: string) {
    return this.requestService.axios.delete<HowellResponse<GisMap>>(
      AIOPGisMapUrl.del(id)
    );
  }

  list(item: GetMapElementsParams) {
    return this.requestService.axios.post<
      GetMapElementsParams,
      HowellResponse<PagedList<GisMap>>
    >(AIOPGisMapUrl.list(), item);
  }
}

// @Injectable({
//     providedIn:'root'
// })
// export class ElementRequestService{
//     url: url.GisMapElement;
//     constructor(private requestService: RequestService) {
//         this.url = new url.GisMapElement();
//     }
//     create(item:IMapElement){
//         return this.requestService.axios.post<IMapElement, HowellResponse<IMapElement>>(this.url.create(item.MapId), item);
//     }

//     get(mapId: string,eleId:string) {
//         return this.requestService.axios.get<HowellResponse<IMapElement>>(this.url.get(mapId,eleId));
//     }

//     set(item: IMapElement){
//         return this.requestService.axios.put<IMapElement, HowellResponse<IMapElement>>(this.url.edit(item.MapId,item.Id),item);
//     }

//     del(mapId: string,eleId:string) {
//         return this.requestService.axios.delete<HowellResponse<IMapElement>>(this.url.del(mapId,eleId));
//     }

//     list(item:GetMapElementsParams){
//         return this.requestService.axios.post<GetMapElementsParams,  HowellResponse<PagedList<IMapElement>>>(this.url.list(), item);
//     }
// }

@Injectable({
  providedIn: "root",
})
export class ElementResourceRequestService {
  constructor(private requestService: RequestService) {}
  create(mapId: string, eleId: string, sourceId: string) {
    return this.requestService.axios.post<Resource, HowellResponse<Resource>>(
      AIOPGisMapElementResourceUrl.create(mapId, eleId, sourceId)
    );
  }

  get(mapId: string, eleId: string, sourceId: string) {
    return this.requestService.axios.get<HowellResponse<Resource>>(
      AIOPGisMapElementResourceUrl.get(mapId, eleId, sourceId)
    );
  }

  list(mapId: string, eleId: string) {
    return this.requestService.axios.get<HowellResponse<Resource[]>>(
      AIOPGisMapElementResourceUrl.list(mapId, eleId)
    );
  }

  del(mapId: string, eleId: string, sourceId: string) {
    return this.requestService.axios.delete<HowellResponse<Resource>>(
      AIOPGisMapElementResourceUrl.del(mapId, eleId, sourceId)
    );
  }
}
