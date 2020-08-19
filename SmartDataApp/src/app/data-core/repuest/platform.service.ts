import { Platform as PlatformUrl } from "../url/platforms";
import { Response } from "../model/Response";
import { Platform as PlatformModel, Platform } from "../model/platform";
import { Injectable } from "@angular/core";
import { RequestService } from "./Request.service";
import { GetPlatformsParams } from "../model/platforms-Params";
import { PagedList } from "../model/page";
import { Protocol } from "../model/protocol";

@Injectable({
    providedIn: 'root'
})
export class PlatformRequestSerivce{
    url: PlatformUrl;
    constructor(private requestService: RequestService) {
        this.url = new PlatformUrl();
    }

    create(item: PlatformModel) {
        return this.requestService.axios.post<PlatformModel, Response<PlatformModel>>(this.url.create(), item);
    }

    get(id: string) {
        return this.requestService.axios.get<Response<PlatformModel>>(this.url.get(id));
    }

    set(item: PlatformModel){
        return this.requestService.axios.put<PlatformModel, Response<PlatformModel>>(this.url.edit(item.Id),item);
    }

    del(id: string) {
        return this.requestService.axios.delete<Response<PlatformModel>>(this.url.del(id));
    }

    list(item:GetPlatformsParams){
        return this.requestService.axios.post<GetPlatformsParams, Response<PagedList<Platform>>>(this.url.list(), item);
    }

    protocol(){
        return this.requestService.axios.get<Response<Protocol[]>>(this.url.protocols());
    }

    sync(id:string){
        return this.requestService.axios.post< Response<any>>(this.url.sync(id));
    }
}