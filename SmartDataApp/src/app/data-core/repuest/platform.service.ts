import { Platform as PlatformUrl } from "../url/aiop/platforms";
import { Response } from "../model/Response";
import { Platform as PlatformModel, Platform } from "../model/aiop/platform";
import { Injectable } from "@angular/core"; 
import { GetPlatformsParams } from "../model/aiop/platforms-Params";
import { PagedList } from "../model/page";
import { Protocol } from "../model/aiop/protocol";
import { HowellAuthHttpService } from "./howell-auth-http.service";
import { SaveModel } from "../model/save-model";

@Injectable({
    providedIn: 'root'
})
export class PlatformRequestSerivce extends SaveModel{
    url: PlatformUrl;
    constructor(private requestService: HowellAuthHttpService) {
        super();
        this.url = new PlatformUrl();
    }

    create(item: PlatformModel) {
        return this.requestService.post<PlatformModel, Response<PlatformModel>>(this.url.create(), this.toModel(item,this.formMustField.platform));
    }

    get(id: string) {
        return this.requestService.get<PlatformModel>(this.url.get(id));
    }

    set(item: PlatformModel){
        return this.requestService.put<PlatformModel, Response<PlatformModel>>(this.url.edit(item.Id),item);
    }

    del(id: string) {
        return this.requestService.delete<PlatformModel>(this.url.del(id));
    }

    list(item:GetPlatformsParams){
        return this.requestService.post<GetPlatformsParams, Response<PagedList<Platform>>>(this.url.list(), item);
    }

    protocol(){
        return this.requestService.get<Protocol[]>(this.url.protocols());
    }

    sync(id:string){
        return this.requestService.post<any>(this.url.sync(id));
    }
}