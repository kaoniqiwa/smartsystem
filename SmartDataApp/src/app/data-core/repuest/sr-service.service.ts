import { SRService as SRServiceUrl } from "../url/sr-server";
import { Response } from "../model/Response";
import { SRServer } from "../model/sr-server";
import { VideoUrl, GetPreviewUrlParams, GetVodUrlParams } from "../model/video-url";
import { Injectable } from "@angular/core";
import { RequestService } from "./Request.service";
import { HowellAuthHttpService } from "./howell-auth-http.service";

@Injectable({
    providedIn: 'root'
})
export class SRServiceRequestSerivce {
    url: SRServiceUrl;
    constructor(private requestService: HowellAuthHttpService) {
        this.url = new SRServiceUrl();
    }

    create(item: SRServer) {
        return this.requestService.post<SRServer, Response<SRServer>>(this.url.create(), item);
    }

    get(id: string) {
        return this.requestService.get<SRServer>(this.url.get(id));
    }

    set(item: SRServer) {
        return this.requestService.put<SRServer, Response<SRServer>>(this.url.edit(item.Id), item);
    }

    del(id: string) {
        return this.requestService.delete<SRServer>(this.url.del(id));
    }

    list() {
        return this.requestService.get<SRServer[]>(this.url.list());
    }

    sync(id: string) {
        return this.requestService.post<any>(this.url.sync(id));
    }

    preview(item: GetPreviewUrlParams) {
        return this.requestService.post<GetPreviewUrlParams, Response<VideoUrl>>(this.url.list(), item);
    }

    vod(item: GetVodUrlParams) {
        return this.requestService.post<GetVodUrlParams, Response<VideoUrl>>(this.url.list(), item);
    }
}