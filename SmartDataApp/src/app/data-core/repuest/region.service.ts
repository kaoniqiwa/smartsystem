import { Injectable } from "@angular/core";
import { SaveModel } from "../model/save-model";
import { Region ,GetRegionsParams} from "../model/region";
import { RequestService } from "./Request.service";
import * as url from "../url/region";
import { PagedList } from "../model/page";
import { Response } from "../model/Response";
import { BatchRequest,BatchResult,SingleResult } from "../model/batch";
import { Resource } from "../model/resource";
import { HowellAuthHttpService } from "./howell-auth-http.service";
@Injectable({
    providedIn:'root'
})
export class RegionRequestService extends SaveModel{
    url: url.Region;
    constructor(private requestService: HowellAuthHttpService) {
        super();
        this.url = new url.Region();
    }
    create(item:Region){ 
        return this.requestService.post<Region, Response<Region>>(this.url.create(), this.toModel(item,this.formMustField.region));
    }

    get(id: string) {
        return this.requestService.get<Region>(this.url.get(id));
    }

    set(item: Region){
    
        return this.requestService.put<Region, Response<Region>>(this.url.edit(item.Id), this.toModel(item,this.formMustField.region));
    }

    del(id: string) {
        return this.requestService.delete<Region>(this.url.del(id));
    }

    list(item:GetRegionsParams){
        return this.requestService.post<GetRegionsParams, PagedList<Region>>(this.url.list(), item);
    }
}

@Injectable({
    providedIn:'root'
})
export class RegionResourceRequestService {
    url: url.RegionsResources;
    constructor(private requestService: HowellAuthHttpService) {      
        this.url = new url.RegionsResources();
    }
    batch(regionId:string,item: BatchRequest){
        return this.requestService.post<BatchRequest, BatchResult>(this.url.batch(regionId),item);
    }

    create(regionId: string,resourceId: string){ 
        return this.requestService.post<null, Resource>(this.url.create(regionId,resourceId));
    }

    get(regionId: string,resourceId: string) {
        return this.requestService.get<Resource>(this.url.get(regionId,resourceId));
    }
 
    del(regionId: string,resourceId: string) {
        return this.requestService.delete<Resource>(this.url.del(regionId,resourceId));
    }

}