import { Injectable } from "@angular/core";
import { GetRegionsParams, Region } from "../../../../data-core/model/aiop/region";
import { ListAttribute } from "../../../../common/tool/table-form-helper";
import { RegionRequestService } from "../../../../data-core/repuest/region.service";
import { CameraRequestService } from "../../../../data-core/repuest/resources.service";
import { GetCamerasParams } from "../../../../data-core/model/aiop/encode-devices-params";
import { Camera } from "../../../../data-core/model/aiop/camera";  
@Injectable()
export class DataService { 
    regions = new Array<Region>(); 
    cameras = new Array<Camera>();
    constructor(private regionService: RegionRequestService
        , private cameraService: CameraRequestService) {

    }

    async requestCameras(regionIds: string[]) {
        const param = new GetCamerasParams();
        param.PageIndex = 1;
        param.RegionIds = regionIds
        param.PageSize = new ListAttribute().maxSize;
        const response = await this.cameraService.list(param).toPromise();         
         return response.Data.Data;
    } 

    async requestRegion() {
        const param = new GetRegionsParams();
        param.PageIndex = 1;
        param.PageSize = new ListAttribute().maxSize;
        const response = await this.regionService.list(param).toPromise();
        return  response.Data.Data; 
    } 

    async allCamera(regions:Region[]) {
        const ids = new Array<string>();
        regions.map(x=>ids.push(x.Id));
        return  await this.requestCameras(ids); 
    }
}