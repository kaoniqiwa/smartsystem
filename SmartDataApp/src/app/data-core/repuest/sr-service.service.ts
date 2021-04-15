import { SRService as SRServiceUrl } from "../url/aiop/sr-server";
import { Response } from "../model/Response";
import { SRServer } from "../model/aiop/sr-server";
import { VideoUrl, GetPreviewUrlParams, GetVodUrlParams } from "../model/aiop/video-url";
import { Injectable } from "@angular/core";
import { HowellAuthHttpService } from "./howell-auth-http.service";
import { SaveModel } from "../model/save-model";
import { VideoPlayArgs } from "src/app/video/mode";
import { SessionUser } from "src/app/common/tool/session-user";

@Injectable({
    providedIn: 'root'
})
export class SRServiceRequestSerivce extends SaveModel {
    url: SRServiceUrl;
    user = new SessionUser();
    constructor(private requestService: HowellAuthHttpService) {
        super();
        this.url = new SRServiceUrl();
    }

    create(item: SRServer) {
        return this.requestService.post<SRServer, Response<SRServer>>(this.url.create(), this.toModel(item, this.formMustField.srServer));
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

    async preview(item: GetPreviewUrlParams) {
        const response = await this.requestService.post<GetPreviewUrlParams, Response<VideoUrl>>(this.url.list(), item).toPromise();
        if (response.Data.Url) {
            let args = VideoPlayArgs.FromUrl(response.Data.Url);
            if (response.Data.Username) {
                args.username = response.Data.Username;
            }
            if (response.Data.Password) {
                args.password = response.Data.Password;
            }
            let url = "";
            if (!(args.username && args.password)) {
                url = args.toString(this.user.videoUserPwd);
            }
            else {
                url = args.toString();
            }
            response.Data.Url = url;
        }
        return response;
    }

    async vod(item: GetVodUrlParams) {
        const response = await this.requestService.post<GetVodUrlParams, Response<VideoUrl>>(this.url.list(), item).toPromise();
        if (response.Data.Url) {
            let args = VideoPlayArgs.FromUrl(response.Data.Url);
            if (response.Data.Username) {
                args.username = response.Data.Username;
            }
            if (response.Data.Password) {
                args.password = response.Data.Password;
            }
            let url = "";
            if (!(args.username && args.password)) {
                url = args.toString(this.user.videoUserPwd);
            }
            else {
                url = args.toString();
            }
            response.Data.Url = url;
        }
        return response;
    }
}