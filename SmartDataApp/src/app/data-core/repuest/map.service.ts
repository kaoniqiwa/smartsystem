import { Injectable } from "@angular/core";  
import { RequestService } from "./Request.service";
import { PagedList } from "../model/page";
import { Response } from "../model/Response";  
import * as url from "../url/maps";
import { Map as GisMap } from "../model/map";
import { MapElement } from "../model/map-element"; 
import { GetMapElementsParams } from "../model/map-elements-params";
import { Resource } from "../model/resource";
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

@Injectable({
    providedIn:'root'
})
export class ElementRequestService{
    url: url.GisMapElement;
    constructor(private requestService: RequestService) {
        this.url = new url.GisMapElement();
    }
    create(item:MapElement){
        return this.requestService.axios.post<MapElement, Response<MapElement>>(this.url.create(item.MapId), item);
    }

    get(mapId: string,eleId:string) {
        return this.requestService.axios.get<Response<MapElement>>(this.url.get(mapId,eleId));
    }

    set(item: MapElement){
        return this.requestService.axios.put<MapElement, Response<MapElement>>(this.url.edit(item.MapId,item.Id),item);
    }

    del(mapId: string,eleId:string) {
        return this.requestService.axios.delete<Response<MapElement>>(this.url.del(mapId,eleId));
    } 

    list(item:GetMapElementsParams){
        return this.requestService.axios.post<GetMapElementsParams,  Response<PagedList<MapElement>>>(this.url.list(), item);
    }
}


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
