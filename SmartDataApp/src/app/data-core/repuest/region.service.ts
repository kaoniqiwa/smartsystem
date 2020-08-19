import { Injectable } from "@angular/core";
import { SaveModel } from "../model/save-model";
import { Region ,GetRegionsParams} from "../model/region";
import { RequestService } from "./Request.service";
import * as url from "../url/region";
import { PagedList } from "../model/page";
import { Response } from "../model/Response";
import { BatchRequest,BatchResult,SingleResult } from "../model/batch";
import { Resource } from "../model/resource";
@Injectable({
    providedIn:'root'
})
export class RegionRequestService extends SaveModel{
    url: url.Region;
    constructor(private requestService: RequestService) {
        super();
        this.url = new url.Region();
    }
    create(item:Region){ 
        return this.requestService.axios.post<Region, Response<Region>>(this.url.create(), this.toModel(item,this.formMustField.region));
    }

    get(id: string) {
        return this.requestService.axios.get<Response<Region>>(this.url.get(id));
    }

    set(item: Region){
    
        return this.requestService.axios.put<Region, Response<Region>>(this.url.edit(item.Id), this.toModel(item,this.formMustField.region));
    }

    del(id: string) {
        return this.requestService.axios.delete<Response<Region>>(this.url.del(id));
    }

    list(item:GetRegionsParams){
        return this.requestService.axios.post<GetRegionsParams, Response<PagedList<Region>>>(this.url.list(), item);
    }
}

@Injectable({
    providedIn:'root'
})
export class RegionResourceRequestService {
    url: url.RegionsResources;
    constructor(private requestService: RequestService) {      
        this.url = new url.RegionsResources();
    }
    batch(regionId:string,item: BatchRequest){
        return this.requestService.axios.post<BatchRequest, Response<BatchResult>>(this.url.batch(regionId),item);
    }

    create(regionId: string,resourceId: string){ 
        return this.requestService.axios.post<null, Response<Resource>>(this.url.create(regionId,resourceId));
    }

    get(regionId: string,resourceId: string) {
        return this.requestService.axios.get<Response<Resource>>(this.url.get(regionId,resourceId));
    }
 
    del(regionId: string,resourceId: string) {
        return this.requestService.axios.delete<Response<Resource>>(this.url.del(regionId,resourceId));
    }

}