import { Injectable } from "@angular/core";  
import { RequestService } from "./Request.service";
import { PagedList } from "../model/page";
import { Response } from "../model/Response";  
import * as url from "../url/maps";
import { Map as GisMap } from "../model/map";
import { GetMapElementsParams } from "../model/map-elements-params";
import { Resource } from "../model/resource";
import { HowellAuthHttpService } from "./howell-auth-http.service";
@Injectable({
    providedIn:'root'
})
export class MapRequestService{
    url: url.GisMap;
    constructor(private requestService: RequestService) {
        this.url = new url.GisMap();
    }
    create(item:GisMap){
        return this.requestService.axios.post<GisMap, Response<GisMap>>(this.url.create(), item);
    }

    get(id: string) {
        return this.requestService.axios.get<Response<GisMap>>(this.url.get(id));
    }

    set(item: GisMap){
        return this.requestService.axios.put<GisMap, Response<GisMap>>(this.url.edit(item.Id),item);
    }

    del(id: string) {
        return this.requestService.axios.delete<Response<GisMap>>(this.url.del(id));
    }

    list(item:GetMapElementsParams){
        return this.requestService.axios.post<GetMapElementsParams, Response<PagedList<GisMap>>>(this.url.list(), item);
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
//         return this.requestService.axios.post<IMapElement, Response<IMapElement>>(this.url.create(item.MapId), item);
//     }

//     get(mapId: string,eleId:string) {
//         return this.requestService.axios.get<Response<IMapElement>>(this.url.get(mapId,eleId));
//     }

//     set(item: IMapElement){
//         return this.requestService.axios.put<IMapElement, Response<IMapElement>>(this.url.edit(item.MapId,item.Id),item);
//     }

//     del(mapId: string,eleId:string) {
//         return this.requestService.axios.delete<Response<IMapElement>>(this.url.del(mapId,eleId));
//     } 

//     list(item:GetMapElementsParams){
//         return this.requestService.axios.post<GetMapElementsParams,  Response<PagedList<IMapElement>>>(this.url.list(), item);
//     }
// }


@Injectable({
    providedIn:'root'
})
export class ElementResourceRequestService{
    url: url.GisMapElementResource;
    constructor(private requestService: RequestService) {
        this.url = new url.GisMapElementResource();
    }
    create(mapId:string,eleId:string,sourceId:string){
        return this.requestService.axios.post<Resource, Response<Resource>>(this.url.create(mapId,eleId,sourceId));
    }

    get(mapId:string,eleId:string,sourceId:string){
        return this.requestService.axios.get<Response<Resource>>(this.url.get(mapId,eleId,sourceId));
    }

    list(mapId:string,eleId:string){
        return this.requestService.axios.get<Response<Resource[]>>(this.url.list(mapId,eleId));
    }

    del(mapId:string,eleId:string,sourceId:string){
        return this.requestService.axios.delete<Response<Resource>>(this.url.del(mapId,eleId,sourceId));
    }
}
