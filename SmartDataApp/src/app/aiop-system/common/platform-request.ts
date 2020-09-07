import { Injectable } from "@angular/core";
import { PlatformRequestSerivce } from "../../data-core/repuest/platform.service";
import { GetPlatformsParams } from "../../data-core/model/aiop/platforms-Params"; 
@Injectable()
export class PlatformService  {
    constructor(private platformRequestSerivce: PlatformRequestSerivce) {
        
    }

    async syncPlatform() {
        const param = new GetPlatformsParams();
        param.PageIndex = 1;
        param.PageSize = 1;
        const response = await this.platformRequestSerivce.list(param).toPromise();
        for (const d of response.Data.Data) 
          await  this.platformRequestSerivce.sync(d.Id).toPromise();         
    }
}