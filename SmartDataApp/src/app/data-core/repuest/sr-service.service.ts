import { SRService as SRServiceUrl } from "../url/sr-server";
import { Response } from "../model/Response";
import { SRServer } from "../model/sr-server";
import { VideoUrl ,GetPreviewUrlParams,GetVodUrlParams} from "../model/video-url";
import { Injectable } from "@angular/core";
import { RequestService } from "./Request.service"; 

@Injectable({
    providedIn: 'root'
})
export class  SRServiceRequestSerivce{
    url: SRServiceUrl;
    constructor(private requestService: RequestService) {
        this.url = new SRServiceUrl();
    }

    create(item: SRServer) {
        return this.requestService.axios.post<SRServer, Response<SRServer>>(this.url.create(), item);
    }

    get(id: string) {
        return this.requestService.axios.get<Response<SRServer>>(this.url.get(id));
    }

    set(item: SRServer){
        return this.requestService.axios.put<SRServer, Response<SRServer>>(this.url.edit(item.Id),item);
    }

    del(id: string) {
        return this.requestService.axios.delete<Response<SRServer>>(this.url.del(id));
    }

    list(){
        return this.requestService.axios.get<Response<SRServer[]>>(this.url.list());
    } 

    sync(id:string){
        return this.requestService.axios.post< Response<any>>(this.url.sync(id));
    }

    preview(item:GetPreviewUrlParams){
        return this.requestService.axios.post<GetPreviewUrlParams, Response<VideoUrl>>(this.url.list(), item);
    }

    vod(item:GetVodUrlParams){
        return this.requestService.axios.post<GetVodUrlParams, Response<VideoUrl>>(this.url.list(), item);
    }
}